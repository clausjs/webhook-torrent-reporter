import moment from "moment";
import { APIEmbed, EmbedField, WebhookMessageCreateOptions } from "discord.js";

import TVDB from '../connectors/tvmaze';
import WebhookReportEmbedBuilder, { GenericWebhookPayload } from "./WebhookReportEmbedBuilder";
import { TVMazeFullResult, TorrentParseResult, TorrentReport } from "../types";

class TVReportEmbedBuilder extends WebhookReportEmbedBuilder {
    color: number;

    constructor(client?: string, genericPayload: boolean = false) {
        super(client, genericPayload);
        this.color = 0xf9e003;
    }
    private prettifyEpisodeSummary(summary: string): string {
        return summary.replace(/<\/?[a-zA-Z]>/gi, '');
    }
    private getTVTitle(result: TVMazeFullResult): { title: string, url: string } {
        const { report: parsedTorrent } = result;

        let title: string = result.show.name;

        let season: string | undefined = result.episode?.season.toString() || parsedTorrent?.season?.toString();
        let episode: string | undefined = result.episode?.number.toString() || parsedTorrent?.episode?.toString();

        if (season && episode) {
            title += ` - Season: ${season} | Episode: ${episode}`;
        }

        return { title, url: `https://imdb.com/title/${result.show.externals.imdb}/${season ? `episodes?season=${season}` : ''}` };
    }
    private getTVDescription(result: TVMazeFullResult): string | undefined {
        return result.episode ? `**${result.episode.name}**\n\n${this.prettifyEpisodeSummary(result.episode.summary)}\n\n` : undefined;
    }
    private getTVFields(report: TorrentReport, result: TVMazeFullResult): EmbedField[] {
        const fields = super.getFileReportFields(report);
        fields.concat([
            {
                name: ' ',
                value: ' ',
                inline: false
            },
            {
                name: 'Original Air Date',
                value: moment(result.episode?.airdate).format('MMMM Do YYYY, h:mm:ss a'),
                inline: true
            },
            {
                name: 'Runtime',
                value: `${result.episode?.runtime} minutes`,
                inline: true
            },
            
        ]);

        if (result.episode?.rating && result.episode?.rating.average !== null) {
            fields.push({
                name: 'Rating',
                value: `${result.episode?.rating.average}/10`,
                inline: true
            });
        }

        return fields;
    }
    async constructTVReportWebhookPayload(report: TorrentReport): Promise<WebhookMessageCreateOptions | GenericWebhookPayload> {
        if (!this.genericPayload) {
            let result: TVMazeFullResult | undefined;

            
            result = await TVDB.searchForMediaInformation(report.fileName);

            if (result) {
                const messageContent: string = super.getMessageContent(report);
                const title: { title: string, url: string } = this.getTVTitle(result);
                const description: string | undefined = this.getTVDescription(result);
                const fields: EmbedField[] = this.getTVFields(report, result);
                const image: string | undefined = result.episode ? result.episode.image?.medium : result.show.image?.medium;
                const thumbnail: string | undefined = result.episode ? result.show.image?.original : undefined;
                const embed: APIEmbed = this.getEmbedObject(this.color, title.title, description, title.url, image, fields, thumbnail);
                return { content: messageContent, tts: false, embeds: [embed] };
            }
        }

        return super.constructGenericWebhookPayload(report);
    }
}

export default TVReportEmbedBuilder;