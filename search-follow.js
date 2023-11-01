require('dotenv').config()
const Twit = require('twit')


var T = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,
  strictSSL:            true, 
})
var stream = T.stream('statuses/filter', { track: ['#blacktechtwitter', '#codelife'], language: 'en' })

stream.on('tweet', function (tweet) {
  //...
  var user = tweet.user;
  try {
    T.post('friendships/create', {screen_name: user.screen_name})
    console.log('Followed ' + user.screen_name)
  } catch (error) {
    console.log(error)
    }
  })
