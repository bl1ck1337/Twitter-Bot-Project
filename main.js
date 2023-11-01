require('dotenv').config()
const Twit = require('twitter-v2')
const { Client } = require('discord.js');
const client = new Client({ intents: 2048 });


var T = new Twit({
  bearer_token:  process.env.BEARER_TOKEN
})

//   //only show owner tweets
async function sendMessage (tweet, client){
  console.log(tweet)
  const url = "https://twitter.com/user/status/" + tweet.id;
  try {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID)
    channel.send(`${process.env.CHANNEL_MESSAGE} ${url}`)
  } catch (error) {
        console.error(error);
  }
}

async function listenForever(streamFactory, dataConsumer) {
  try {
    for await (const { data } of streamFactory()) {
      dataConsumer(data);
    }
    // The stream has been closed by Twitter. It is usually safe to reconnect.
    console.log('Stream disconnected healthily. Reconnecting.');
    listenForever(streamFactory, dataConsumer);
  } catch (error) {
    console.warn('Stream disconnected with error. Retrying.', error);
   // listenForever(streamFactory, dataConsumer);
  }
}

async function  setup () {
  const endpointParameters = {
      'tweet.fields': [ 'author_id', 'conversation_id' ],
      'expansions': [ 'author_id', 'referenced_tweets.id' ],
      'media.fields': [ 'url' ]
  }
  try {
    console.log('Setting up Twitter....')
    const body = {
      "add": [
        {"value": "from:"+ process.env.TWITTER_USER_NAME, "tag": "from Me!!"}
      ]
    }
   const r = await T.post("tweets/search/stream/rules", body);

  } catch (err) {
    console.log(err)
  }

  listenForever(
    () => T.stream('tweets/search/stream'),
    (data) => sendMessage(data, client)
  );
}
// Add above rule

client.login(process.env.DISCORD_TOKEN)
 client.on('ready', () => {
   console.log('Discord ready')
   setup()

 })
