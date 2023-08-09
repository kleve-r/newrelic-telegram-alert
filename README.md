
# This is a simple API Gateway that allows you to configure a Telegram webhook destination in a New Relic Workflow to send alerts to a Telegram channel or group.

I took the basis for this project here - [jdezego/new-relic-telegram-alerts](https://github.com/jdezego/new-relic-telegram-alerts) *separate paragraph*.

***


You must first create a Telegram Bot and add it to your channel/group as an admin: https://core.telegram.org/bots/tutorial

- Create a Telegram channel or group
- Contact @BotFather to create a new bot and follow the instructions
- Follow instructions to create a new bot
- Note bot API key
- Add the created bot to the channel/group and enable sending messages

Get chat id for group or channel. Must already have messages in group/channel or this returns empty array:
https://api.telegram.org/bot[BOT_API_KEY]/getUpdates

Send message to bot using chat id:
https://api.telegram.org/bot[BOT_API_KEY]/sendMessage?chat_id=[CHAT_ID]&text=[MESSAGE]

---


In order to run the project in the console, enter node index.js

```shell
node index.js
```

To send a message (locally), you need to make a POST request to `127.0.0.1:3000`. In body, pass json from [example](../blob/main/payloadExample.json). It is also necessary to add `Headers` to the request:

```shell
apikey: [YOUR BOT API KEY]
chatid: [YOUR CHAT ID]
```