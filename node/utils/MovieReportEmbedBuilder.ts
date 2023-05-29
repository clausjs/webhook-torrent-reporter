import moment from "moment";
import { APIEmbed, EmbedField, WebhookMessageCreateOptions } from "discord.js";

import { parseFileName } from ".";
import OMDBApi from "../connectors/omdb";
import WebhookReportEmbedBuilder, { GenericWebhookPayload } from "./WebhookReportEmbedBuilder";
import { OMDBMovieResult, TitleSearchResponse, TorrentReport } from "../types";
import logger from '../logger';

const DEV = process.env.NODE_ENV === "dev";

class MovieReportEmbedBuilder extends WebhookReportEmbedBuilder {
    color: number;

    constructor(client?: string, genericPayload: boolean = false) {
        super(client, genericPayload);
        this.color = 0xffdd00;
    }
    private getMovieTitle(movie: TitleSearchResponse): { title: string, url: string } {
        const title: string = `${movie.Title} (${movie.Year})`;
        const url: string = `https://www.imdb.com/title/${movie.imdbID}/`;

        return { title, url };
    }
    private getMovieDescription(movie: OMDBMovieResult): string {
        let description: string = `${movie.Genre}\n\n`;
        description += `${movie.Plot}\n\n`;
        description += `🎬 **Director:** ${movie.Director}\n`;
        description += `📝 **Written By:** ${movie.Writer}\n`;
        description += `🎭 **Cast:** ${movie.Actors}\n`;
        description += `📅 **Released:** ${moment(new Date(movie.Released)).format("MMM Do YYYY")}\n\n`;
        description += `🏆 **Awards:** ${movie.Awards}\n\n`;
        
        return description;
    }
    private getMovieFields(report: TorrentReport, movie: OMDBMovieResult): EmbedField[] {
        const fields = super.getFileReportFields(report).concat([
            {
                name: ' ',
                value: ' ',
                inline: false
            },
            {
                name: 'Rated',
                value: movie.Rated,
                inline: true
            },
            {
                name: 'Runtime',
                value: movie.Runtime,
                inline: true
            },
            {
                name: ' ',
                value: ' ',
                inline: false
            }
        ]);

        movie.Ratings?.forEach(rating => {
            fields.push({
                name: rating.Source === 'Internet Movie Database' ? 'IMDB' : rating.Source,
                value: rating.Value,
                inline: true
            });
        });

        return fields;
    }
    async constructMovieReportWebhookPayload(report: TorrentReport): Promise<WebhookMessageCreateOptions | GenericWebhookPayload> {
        if (!this.genericPayload) {
            const OMDB = new OMDBApi(process.env.OMDB_KEY);
            const movieSearchRes: TitleSearchResponse = await OMDB.searchForMovieInformation(report.fileName);
            
            if (movieSearchRes.Response === 'True') {
                const movie = movieSearchRes as OMDBMovieResult;
                const messageContent: string = this.getMessageContent(report);
                const title: { title: string, url: string } = this.getMovieTitle(movie);
                const description: string = this.getMovieDescription(movie);
                const fields: EmbedField[] = this.getMovieFields(report, movie);
                const embed: APIEmbed = this.getEmbedObject(this.color, title.title, description, title.url, movie.Poster, fields, undefined);
                return { content: messageContent, tts: false, embeds: [embed] };
            } else if (movieSearchRes.Error === "Movie not found!") {
                logger.error("Movie not found in OMDb database: ", { fileName: report.fileName, parsed: parseFileName(report.fileName) });
            }
        }

        return super.constructGenericWebhookPayload(report);
    }
}

export default MovieReportEmbedBuilder;