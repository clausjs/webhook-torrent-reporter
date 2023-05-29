const dotenv = require('dotenv').config({ path: `${process.cwd()}/config.ini` });

const TVDB = require('../dist/connectors/tvmaze').default;
const {
    generateTorrentFileName
 } = require('./helpers');

describe("Test that tv api connector finds results for parsed torrents", () => {
    test("TVMaze returns null when no results are found", async () => {
        const res = await TVDB.searchForTVShowInformation('354908dsfhk');

        expect(res === undefined).toBe(true);
    });

    test("Only Murders in the Building returns from TVMaze", async () => {
        const title = 'Only Murders in the Building';
        const generatedTorrentFileName = generateTorrentFileName(title, 'tv');
        const res = await TVDB.searchForTVShowInformation(generatedTorrentFileName);
        const { show, parsedTorrent } = res;

        expect(show === undefined).toBe(false);
        expect(parsedTorrent).not.toBeNull();
        expect(show.name).toBe('Only Murders in the Building');
    });

    test("What We Do in the Shadows returns from TVMaze", async () => {
        const title = 'What We Do in the Shadows';
        const generatedTorrentFileName = generateTorrentFileName(title, 'tv');
        const res = await TVDB.searchForTVShowInformation(generatedTorrentFileName);
        const { show, parsedTorrent } = res;

        expect(show === undefined).toBe(false);
        expect(parsedTorrent).not.toBeNull();
        expect(show.name).toBe('What We Do in the Shadows');
    });

    test("8 out of 10 Cats Does Countdown returns from TVMaze", async () => {
        const title = '8 out of 10 Cats Does Countdown';
        const generatedTorrentFileName = generateTorrentFileName(title, 'tv');
        const res = await TVDB.searchForTVShowInformation(generatedTorrentFileName);
        const { show, parsedTorrent } = res;

        expect(show === undefined).toBe(false);
        expect(parsedTorrent).not.toBeNull();
        expect(show.name).toBe('8 Out of 10 Cats Does Countdown');
    });

    test("The Lord of the Rings: The Rings of Power returns from TVMaze", async () => {
        const title = 'The Lord of the Rings: The Rings of Power';
        const generatedTorrentFileName = generateTorrentFileName(title, 'tv');
        const res = await TVDB.searchForTVShowInformation(generatedTorrentFileName);
        const { show, parsedTorrent } = res;

        expect(show === undefined).toBe(false);
        expect(parsedTorrent).not.toBeNull();
        expect(show.name).toBe('The Lord of the Rings: The Rings of Power');
    });

    test("Bob's Burgers returns from TVMaze", async () => {
        const title = "Bobs Burgers";
        const generatedTorrentFileName = generateTorrentFileName(title, 'tv');
        const res = await TVDB.searchForTVShowInformation(generatedTorrentFileName);
        const { show, parsedTorrent } = res;

        expect(show === undefined).toBe(false);
        expect(parsedTorrent).not.toBeNull();
        expect(show.name).toBe("Bob's Burgers");
    });
});
