const ptn = require("parse-torrent-name");

import { TorrentParseResult } from "../types";

export const parseFileName = (fileName: string): TorrentParseResult => {
    return ptn(fileName) as TorrentParseResult;
}

export { default as WebhookReportEmbedBuilder } from './WebhookReportEmbedBuilder';
export { default as MovieReportEmbedBuilder } from './MovieReportEmbedBuilder';
export { default as TVReportEmbedBuilder } from './TVReportEmbedBuilder';