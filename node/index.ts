import { config } from "dotenv";
config({ path: `${process.cwd()}/config.ini` });

import { WebhookReportEmbedBuilder, MovieReportEmbedBuilder, TVReportEmbedBuilder }  from './utils';
import logger from './logger';
import { TorrentReport } from "./types";
import { WebhookMessageCreateOptions } from "discord.js";
import { GenericWebhookPayload } from "./utils/WebhookReportEmbedBuilder";
import { post } from "./utils/fetch";

const CLIENT = process.env.TORRENT_CLIENT_NAME;
const GENERIC_PAYLOAD = Boolean(process.env.USE_GENERIC_PAYLOAD);

interface ScriptParams {
    webhook_url?: string;
    category: string;
    file_name: string;
    file_size_bytes: number;
    number_of_files: number;
}

const executeScript = async (params: ScriptParams) => {

    const { webhook_url, category, file_name, file_size_bytes, number_of_files } = params;

    if (!webhook_url) return;

    const movies: string | undefined = process.env.MOVIES_CATEGORY;
    const tv: string | undefined = process.env.TV_CATEGORY;
    const music: string | undefined = process.env.MUSIC_CATEGORY;

    const report: TorrentReport = {
        fileName: file_name,
        fileSizeBytes: file_size_bytes,
        numberOfFiles: number_of_files
    }

    let postData: WebhookMessageCreateOptions | GenericWebhookPayload | undefined; 

    if (movies && category === movies) {
        logger.info(`Found movie tag with file: ${report.fileName}`);
        const reportBuilder = new MovieReportEmbedBuilder(CLIENT, GENERIC_PAYLOAD);
        postData = await reportBuilder.constructMovieReportWebhookPayload(report);
    } else if (tv && category === tv) {
        logger.info(`Found tv tag with file: ${report.fileName}`);
        const reportBuilder = new TVReportEmbedBuilder(CLIENT, GENERIC_PAYLOAD);
        postData = await reportBuilder.constructTVReportWebhookPayload(report);
    } else if (music && category === music) {
        // TODO: Need to find a way to parse music torrents
        // to search an api
    } else {
        logger.info(`Found no tags with file; using default post: ${report.fileName}`);
        const reportBuilder = new WebhookReportEmbedBuilder(CLIENT, GENERIC_PAYLOAD);
        postData = await reportBuilder.constructGenericWebhookPayload(report);
    }

    try {
        if (postData) await post(webhook_url, postData);
    } catch (err) {
        logger.error("Error posting webhook: ", err);
    }
}

const args = process.argv;
const scriptParams: ScriptParams = {
    webhook_url: process.env.WEBHOOK_URL,
    category: args[2],
    file_name: args[3] as string,
    file_size_bytes: Number(args[4]),
    number_of_files: Number(args[5])
}

if (!scriptParams.webhook_url) {
    logger.error("No webhook url provided. There is no action this script can perform", () => {
        process.exit(1);
    });
} else if (!scriptParams.category || !scriptParams.file_name || !scriptParams.file_size_bytes || !scriptParams.number_of_files) {
    logger.error("Missing required command line arguments. There is no action this script can perform", () => {
        process.exit(1);
    });
} else if (isNaN(scriptParams.file_size_bytes) || isNaN(scriptParams.number_of_files)) {
    logger.error("The file size and number of files arguments provided are not numbers. Something went wrong. Please check environment variables.", () => {
        process.exit(0);
    });
} else {
    executeScript(scriptParams);
}


