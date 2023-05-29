import { TorrentParseResult } from "./common";

export interface TVMazeResultImage {
    medium: string;
    original: string;
}

interface TVMazeLinks {
    self: {
        href: string;
    };
    previousepisode: {
        href: string;
    };
}

export interface TVMazeSingleSearchResult {
    id: number;
    url: string;
    name: string;
    type: string;
    language: string;
    genres: string[];
    status: string;
    runtime: number;
    premiered: string | null;
    ended: string | null;
    officialSite: string;
    schedule: {
        time: string;
        days: string[];
    };
    rating: {
        average: number;
    };
    weight: number;
    network: {
        id: number;
        name: string;
        country: {
            name: string;
            code: string;
            timezone: string;
        };
        officialSite: string;
    };
    webChannel: null;
    dvdCountry: null;
    externals: {
        tvrage: number;
        thetvdb: number;
        imdb: string;
    };
    image: TVMazeResultImage;
    summary: string;
    updated: number;
    _links: TVMazeLinks;
}

export interface TVMazeEpidodeResult {
    id: number;
    url: string;
    name: string;
    season: number;
    number: number;
    type: string;
    airdate: string;
    airtime: string;
    airstamp: string;
    runtime: number;
    rating: {
        average: number;
    };
    image: TVMazeResultImage;
    summary: string;
    _links: TVMazeLinks;
}

export interface TVMazeFullResult {
    show: TVMazeSingleSearchResult;
    episode?: TVMazeEpidodeResult;
    report?: TorrentParseResult;
}
