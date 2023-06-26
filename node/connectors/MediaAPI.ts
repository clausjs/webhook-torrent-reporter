
import {TorrentParseResult} from "../types";
import ptn from '../parse-torrent-name';

class MediaAPI {
    isDev: boolean;
    key?: string;

    constructor(key?: string) {
        this.isDev = process.env.NODE_ENV === "dev";
        this.key = key;
    }
    protected isDisabled(): boolean { return this.key === "" }
    protected parseFileName(fileName: string): TorrentParseResult {
        return ptn(fileName) as TorrentParseResult;
    }
    async searchForMediaInformation(fileName: string): Promise<any> { return Promise.resolve("Not implemented.") }
}

export default MediaAPI;