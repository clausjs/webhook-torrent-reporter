import { get } from '../utils/fetch';
import { TVMazeEpidodeResult, TVMazeFullResult, TVMazeSingleSearchResult, TorrentParseResult } from "../types";
import logger from "../logger";
import MediaAPI from './MediaAPI';

class TVMazeApi extends MediaAPI {
    urlBase: string;
    showSearchUrl: string;
    episodeSearchUrl: string;
    data: TVMazeFullResult | undefined;

    constructor() {
        super();
        this.urlBase = "https://api.tvmaze.com/";
        this.showSearchUrl = "singlesearch/shows?q=";
        this.episodeSearchUrl = "shows/<SHOW_ID>/episodebynumber?season=<SEASON>&number=<NUMBER>";
        if (this.isDev) this.data = {
            show: require('./example-data/tvmaze_example_show.json'),
            episode: require('./example-data/tvmaze_example_episode.json'),
        }
    }
    private getEpisodeSearchUrl(showId: number, season: number, episode: number): string {
        return `${this.urlBase}${this.episodeSearchUrl.replace("<SHOW_ID>", showId.toString()).replace("<SEASON>", season.toString()).replace("<NUMBER>", episode.toString())}`;
    }
    async searchForMediaInformation(fileName: string): Promise<TVMazeFullResult | undefined> {
        if (this.data) {
            logger.info("TVMaze API returning example data");
            return this.data;
        }

        const parsedTorrent: TorrentParseResult = this.parseFileName(fileName);
        const cleanTitle: string = parsedTorrent.title;

        try {
            const showResult: TVMazeSingleSearchResult | null = await get(`${this.urlBase}${this.showSearchUrl}${encodeURIComponent(cleanTitle)}`);
            if (showResult) {
                const searchResult: TVMazeFullResult = {
                    show: showResult,
                    report: parsedTorrent
                };

                if (parsedTorrent.season && parsedTorrent.episode) {
                    const episodeResult: TVMazeEpidodeResult | null = await get(this.getEpisodeSearchUrl(searchResult.show.id, parsedTorrent.season, parsedTorrent.episode));
                    if (episodeResult) searchResult.episode = episodeResult;
                }

                return searchResult;
            }
        } catch (err) {
            logger.error(`Error searching for TV show information`, { fileName: fileName, parsed: cleanTitle, error: err });
        }
    }
}

const instance = new TVMazeApi();
export default instance;