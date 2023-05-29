# Disclaimer
When downloading torrents, users are subject to country-specific media distribution laws. This webhook-torrent-reporter is not designed to enable illegal activity. We do not promote piracy nor do we condone it under any circumstances. Please take the time to review copyright laws and/or policies for your country before proceeding.

Torrenting is illegal, even in cases where you are legally allowed to acquire a copy of something (because you've bought it) acquiring it from peer-to-peer services is still illegal. IANAL 

This application should only be used when using torrents to get files from one machine to another **owned by the same user**. If you already have a copy of something you've legally paid for and want to transfer a copy to other machines using the torrent protocol this application can be used to report those files have finished transferring.

# Pre-configuration
A `config.ini` file should be created inside the root folder for the project (or the working directory the app will run from). This file will include environment variables the application will use to determine torrent types/output messaging/and optional lookups.

Required keys:
```
WEBHOOK_URL=<url_to_post_webhook_message>
```

**This is the only required key, the application will exit abrubtly if this is omitted**

## Optional environment variables
Some optional enviornment variables that can be set in `.env` are as follows:

| Setting | Default | Description |
| ------- | ------- | ----------- |
| TORRENT_CLIENT_NAME | `undefined` | The output message will use this string. Ex. "<client_name> has finished downloading [...]" vs "Torrent downloaded: [...]"
| USE_GENERIC_PAYLOAD | `false` | The default value is to format the payload for embedded content in a Discord webhook message. If this value is true, the payload will be sent as just a [generic json blob](###-generic-payload)
| LOG_TO_CONSOLE | `false` | If the application is configured to show the console window when it runs output logging will appear in the console (does not prevent writing to log files)

## Posting Options

- [Default](###-default-posting): This is the simplest form of parsing that requires no additional accounts/codes. Just run the application with the appropriate command line arguments. This will report completed downloads but will do so in a generic matter that is less attractive.

- [Media lookup parsing](###-media-lookup-parsing): This requires keys/accounts with different APIs which will allow the application to parse data about the torrent before posting. The embeded posts will look much cleaner and include links to find more information about the media as well as poster images.

### Default Posting
![xfL4yBATyn](https://github.com/clausjs/webhook-torrent-reporter/assets/12068849/75ea5ca1-4490-460d-998f-8df15eee23b6)

No additional setup required

### Media lookup parsing
Movie: ![MyRC0OTPHv](https://github.com/clausjs/webhook-torrent-reporter/assets/12068849/9b885321-538c-4c92-ad7f-95f06954d7c7)
Tv: ![QT4Xoa8PGm](https://github.com/clausjs/webhook-torrent-reporter/assets/12068849/d99be63c-6c62-447a-afa5-d6b3c8eeef2b)


Services used for data lookup:
- Movies: [OMDb API](http://www.omdbapi.com/). You can create a key [here](http://www.omdbapi.com/apikey.aspx).
- TV: [TVMaze](https://www.tvmaze.com/). No key required, but might be rate limited if polled too often.

Add the appropriate key(s) to your `config.ini`:

```
OMDB_KEY=<omdb_key>
```

`MOVIES_TAG`: The torrent in question needs to be tagged with this tag for the application to pick it up and parse it as a movie. If this tag is ommitted, it won't matter if an OMDB_KEY is added, it will be ignored. **Both `OMDB_KEY` and `MOVIES_TAG` are required for movie lookups. If either is ommitted (or the torrent passed in is missing this tag, then the [default posting](###-default-posting) method will be used**

`TV_TAG`: The torrent in question needs to be tagged with this tag for the application to pick it up and parse it as a tv show.

```
MOVIES_TAG=<tag_name_for_movie_files>
TV_TAG=<tag_name_for_tv_files>
```

**If any of these keys are missing for any particular file type, the parsing will be skipped and the [default posting](###-default-posting) option will be used**

### Generic payload

Generic payload will be in the form of

```
{
    description: string; // This contains what would be the top line of the Discord post: "File downloaded"
    fields: { name: string, value: string }[]; // Contains an array of key value pairs pertaining to information about the file (.e.g [
        {
            name: 'File name',
            value: "bobs.burgers.s13e04.1080p.web.h264-cakes"
        },
        {
            name: 'File size',
            value: '1232432454' //In bytes
        }
    ])
}
```

### Configure launching of app
Using qBittorrent as an example, we can configure the application to launch a program when a torrent completes downloading and pass along the required information via command line arguments. Download and extract the application to a folder where the running user will have access. Go into qBittorrent settings > Downloads > and enable `Run external program on torrent completion`. 

Inside the text box put: `<path_to_exe> %G %N %Z %C`.
**NOTE: The arguments _are_ case sensitive and the order is very important. The directory where <path_to_exe> is should also contain your `config.ini`**

### Acquiring a Discord webhook url
In a server you own or have admin rights to open up the settings for the channel you want the information posted to and click on `Integrations` and under `Webhooks` click `Create Webhook`. 

![zNPHxTlLbc](https://github.com/clausjs/webhook-torrent-reporter/assets/12068849/43a9ff8b-e31f-4617-bf89-e2a23efb97f1)

![aQmGH8QKQm](https://github.com/clausjs/webhook-torrent-reporter/assets/12068849/7503d761-9000-4a04-9c5b-218585d526af)


In the resulting webhook creation box set the icon/name/and channel to whatever setting you desire and click `Copy Webhook URL` which will paste your url to the clipboard and can now be copied to your `config.ini` file. 
