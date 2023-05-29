import { APIEmbed } from "discord.js";

export interface TorrentReport {
    fileName: string;
    fileSizeBytes: number;
    numberOfFiles: number;
}

export interface TorrentParseResult {
    title: string;
    group: string;
    codec: string;
    quality: string;
    resolution?: string;
    audio?: string;
    season?: number;
    episode?: number;
    year?: number;
}