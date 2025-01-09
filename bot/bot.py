from mastodon import Mastodon
from mastodon.streaming import CallbackStreamListener
import requests
import logging
import re
import os.path

logging.basicConfig(level=logging.INFO)

# Setting for the bot
bot_name: str = "@text2torkel"
server_url: str = "http://0.0.0.0:8080/bot"

# Then, log in. This can be done every time your application starts (e.g. when writing a
# simple bot), or you can use the persisted information:
# https://chaos.social/@text2torkel
mastodon = Mastodon(
    access_token='<your-access-token>',
    api_base_url='https://your-mastodon-domain.social'
)

# remove breaking chars from string
def insecure_strip_html(html:str) -> str:
    return re.sub('<[^<]+?>', '', html)

# Define a function to handle mentions
def handle_mention(status) -> None:
    if bot_name in status.content:     
        #clean up the user input and remove the bot name out of it
        content: str = insecure_strip_html(status.content).strip().replace(bot_name, '')
        user: str = status.account.username
        logging.info("content: " + str(content) + " from: " + user)
        
        #idea 1:
        #send back to mastodons
        #mastodon.status_post('@' + user + ' output:' + content)
        
        #idea 2:
        #send back to mastodon with the generated wav file.
        #send to the text2speech api
        response = requests.get(server_url, params = {"text": content})
        logging.info("response http code: " + str(response.status_code))
        #bot_path = "/home/capcom/uni/text2torkel/bot/wav/"
        #file_path: str =  response.content
        logging.info(response.content.decode("utf-8").strip().replace('"', ''))
        path_to_wav = os.path.abspath(response.content.decode("utf-8").strip().replace('"', ''))
        
        if os.path.isfile(path=path_to_wav):
            logging.info("file exists: " + path_to_wav)
        else:
            logging.error("file does not exist: " + path_to_wav)
        
        if "error" in path_to_wav:
            logging.error("found an error")
        else:
            wave = mastodon.media_post(media_file = path_to_wav, description=content, focus=[0.0,0.0], mime_type= "audio/wav", synchronous=True)
            mastodon.status_post('@' + user + " " + content, media_ids=wave["id"], )
        
    else:
        logging.debug(status.content)
    

def start() -> None:
    logging.info("start listening on mention of: " + bot_name)
    listener = CallbackStreamListener(update_handler = handle_mention)
    mastodon.stream_public(listener)

if __name__ == '__main__':
    start()
