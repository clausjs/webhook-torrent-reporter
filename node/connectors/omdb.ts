import { get } from "../utils/fetch";
import { parseFileName } from "../utils";
import { TitleSearchResponse } from "../types";
import logger from '../logger';

const DEV = process.env.NODE_ENV === "dev";
let data: TitleSearchResponse | undefined;
if (DEV) {
    data = require("./example-data/omdbapi_search_example.json");
}

class OMDBApi {
    key: string;

    constructor(key?: string) {
        this.key = key || "";
    }
    isDisabled(): boolean { return this.key === "" }
    async searchForMovieInformation(fileName: string): Promise<TitleSearchResponse> {
        if (data) {
            logger.info("OMDb API returning example data");
            return data;
        }

        const DEFAULT_RESPONSE: TitleSearchResponse = { Response: 'False', Error: 'No data' };
        
        if (this.isDisabled()) {
            logger.warn("OMDBApi is disabled, cannot search for movie information (missing key in .env file)");
            DEFAULT_RESPONSE.Error = "OMDbApi is disabled, no key supplied";
            return DEFAULT_RESPONSE;
        }
        
        try {
            const cleanTitle: string = parseFileName(fileName).title;
            logger.info(`Stripped movie title for torrent name: ${cleanTitle}`);
            const response: TitleSearchResponse = await get(`http://www.omdbapi.com/?apikey=${this.key}&t=${encodeURIComponent(cleanTitle)}`);
            return response;
        } catch (movieSearchError) {
            logger.error("Error searching OMDB for movie information: ", movieSearchError);
            DEFAULT_RESPONSE.Error = (movieSearchError as Error).message;
            return DEFAULT_RESPONSE;
        }
    }
}

export default OMDBApi;