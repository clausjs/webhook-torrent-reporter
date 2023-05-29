const dotenv = require('dotenv').config({ path: `${process.cwd()}/config.ini` });

const OMDBApi = require('../dist/connectors/omdb').default;
const { generateTorrentFileName } = require('./helpers');
const omdb = new OMDBApi(process.env.OMDB_KEY);
const failureOmdb = new OMDBApi();

describe("Test that movie api connector finds results for parsed torrents", () => {
    test("OMDB fails gracefully when key is not found", async () => {
        const movie = await failureOmdb.searchForMovieInformation('The Matrix');
    
        expect(movie.Response).toBe('False');
        expect(movie.Error).toBe('OMDbApi is disabled, no key supplied');
    });
    
    test(`Rocky Balboa parses correctly and recieves information from omdb`, async () => {
        const title = 'Rocky Balboa';
        const generatedTorrentFileName = generateTorrentFileName(title);
        const movie = await omdb.searchForMovieInformation(generatedTorrentFileName);
    
        expect(movie).not.toBeNull();
        expect(movie.Title).toBe('Rocky Balboa');
    });
});

