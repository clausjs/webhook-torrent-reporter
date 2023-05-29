import { APIEmbed, EmbedField, EmbedBuilder, WebhookMessageCreateOptions } from "discord.js";

import { TorrentReport } from "../types";

export interface GenericWebhookPayload {
    description: string;
    fields: EmbedField[];
}

class WebhookReportEmbedBuilder {
    client?: string;
    genericPayload: boolean;

    constructor(client?: string, genericPayload: boolean = false) {
        this.client = client;
        this.genericPayload = genericPayload;
    }
    private convertBytes(bytes: number): string {
        if (bytes === 0) return "0 B";
        
        const size_names: string[] = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const nameIndex: number = Math.floor(Math.log(bytes) / Math.log(1024));
        const size: number = Math.round(bytes / Math.pow(1024, nameIndex));
        return `${size} ${size_names[nameIndex]}`;
    }
    private getDefaultDescription(fileName: string, size: number): string {
        let description = this.client ? `${this.client} has completed a download.` : `Torrent downloaded.`;
        description += `\n\n **${fileName}** was downloaded with a size of **${this.convertBytes(size)}**`;
        return description;
    }
    getMessageContent(report: TorrentReport): string {
        return `${this.client ? `${this.client} has finished downloading **${report.fileName}**` : `Torrent downloaded: **${report.fileName}**`}`
    }
    getFileReportFields(report: TorrentReport): EmbedField[] {
        const fields: EmbedField[] = [
            {
                name: "File Size",
                value: this.convertBytes(report.fileSizeBytes),
                inline: true
            },
            {
                name: "# of Files",
                value: report.numberOfFiles.toString(),
                inline: true
            }
        ];
        return fields;
    }
    getEmbedObject(color: number = 0x000000, title?: string, description?: string, url?: string, image?: string, fields?: EmbedField[], thumbnail?: string, footer?: string): APIEmbed {
        const embed = new EmbedBuilder();
        embed.setColor(color)
        
        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (url) embed.setURL(url);
        if (image) embed.setImage(image);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (fields) embed.addFields(fields);
        if (footer) {
            embed.setFooter({ text: footer });
            embed.setTimestamp();
        }
    
        return embed.data;
    }
    async constructGenericWebhookPayload(report: TorrentReport): Promise<WebhookMessageCreateOptions | GenericWebhookPayload> {
        const description: string = this.getDefaultDescription(report.fileName, report.fileSizeBytes);
        const fields: EmbedField[] = this.getFileReportFields(report);
    
        if (!this.genericPayload) {
            const embed: APIEmbed = this.getEmbedObject(0x000000, undefined, description, undefined, undefined, fields);
            return { tts: false, embeds: [embed] };
        }
    
        return { description, fields };
    }
}

export default WebhookReportEmbedBuilder;