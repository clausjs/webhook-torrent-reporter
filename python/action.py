import requests
import json
import sys
import math

def convert_size(size_bytes):
   if size_bytes == 0:
       return "0B"
   size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
   i = int(math.floor(math.log(size_bytes, 1024)))
   p = math.pow(1024, i)
   s = round(size_bytes / p, 2)
   return "%s %s" % (s, size_name[i])

webhook_url = "https://ptb.discord.com/api/webhooks/1110985952370901012/6ylwoT2Pl_Ue9PbxppP4Ph_SJc5p6NTGF6ummoB_ZaxO0x6b_SiPb_fdB2Hqneop93va"

file_name = sys.argv[1]
file_size_bytes = sys.argv[2]
file_size = convert_size(int(file_size_bytes))

data = {
    'tts': False,
    'embeds': [
        {
            'type': 'rich',
            'title': 'qBittorent Completed Job',
            'description': 'qBittorrent has completed a job. The torrent: **{}** was completed and downloaded a total of: **{}**'.format(file_name, file_size),
            'color': 0xffdd00
        }
    ]
}

req = requests.post(webhook_url, json.dumps(data), headers={'Content-Type': 'application/json'})