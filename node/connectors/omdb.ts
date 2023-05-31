import { get } from "../utils/fetch";
import { TitleSearchResponse } from "../types";
import logger from '../logger';
import MediaAPI from "./MediaAPI";

class OMDBApi extends MediaAPI {
    data: TitleSearchResponse | undefined;

    constructor(key?: string) {
        super(key);
        if (this.isDev) this.data = require('./example-data/omdb_example.json');
    }
    async searchForMediaInformation(fileName: string): Promise<TitleSearchResponse> {
        if (this.data) {
            logger.info("OMDb API returning example data");
            return this.data;
        }

        const DEFAULT_RESPONSE: TitleSearchResponse = { Response: 'False', Error: 'No data' };
        
        if (this.isDisabled()) {
            logger.warn("OMDBApi is disabled, cannot search for movie information (missing key in .env file)");
            DEFAULT_RESPONSE.Error = "OMDbApi is disabled, no key supplied";
            return DEFAULT_RESPONSE;
        }
        
        try {
            const cleanTitle: string = this.parseFileName(fileName).title;
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