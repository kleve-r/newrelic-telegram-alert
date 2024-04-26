/**
 * The basis for this project was taken here:
 * @link https://github.com/jdezego/new-relic-telegram-alerts
 *
 * Newrelic docs + payload
 * @link https://docs.newrelic.com/docs/alerts-applied-intelligence/new-relic-alerts/alert-notifications/notification-channels-control-where-send-alerts/
 * @link https://docs.newrelic.com/docs/alerts-applied-intelligence/notifications/message-templates/#variables-menu
 *
 * telegram message formatting
 * @link https://core.telegram.org/api/entities
 *
 * nginx configuration
 * @link https://dev.to/logrocket/how-to-run-a-node-js-server-with-nginx-588
 *
 */

const express = require("express")
const request = require("request")

const app = express()
const port = 3000

app.use(express.json())

app.post("/", (req, res) => {

    // Getting data about the bot's API key and channel ID from the headers
    const telegramBotAPIKey = req.headers.apikey
    const telegramChatID = req.headers.chatid

    // checking if api key and channel id exist
    if(telegramBotAPIKey === undefined || telegramChatID === undefined){
        console.log('', [telegramBotAPIKey, telegramChatID]);

        res.end();
        return;
    }

    // state message emoji default - 'CRITICAL'
    let emoji = '🔴';
    if(req.body.state.toUpperCase() === 'CLOSED'){
        emoji = '🟢';
    }else {
        if(req.body.priority.toUpperCase() === 'HIGH'){
            emoji = '🟠';
        } else if (req.body.priority.toUpperCase() === 'MEDIUM'){
            emoji = '🔵';
        }
    }


    // title of the message
    let telegramMessage = emoji +
        ` <b><u>${req.body.title.replace(/</g,'&#60;').replace(/>/g,'&#62;')}</u></b> (${req.body.state.toLowerCase()})` + "\n" +
        ` Priority (${req.body.priority})` + "\n\n";
    let messageInfo = [];

    // keys that will be excluded from the body of the message
    let skippedValues = ['title', 'state', 'createdAt', 'updatedAt', 'priority'];
    Object.entries(req.body).forEach(([key, value]) => {
        let keyName = key.replace(/([A-Z])/g, " $1");
        keyName = keyName.charAt(0).toUpperCase() + keyName.slice(1);

        if(!skippedValues.includes(key)){
            if(typeof value === 'string'){
                value = value.replace(/</g,'&#60;').replace(/>/g,'&#62;');
            }
            messageInfo.push(`<b>${keyName}</b>: ${value}`);
        }
    })

    // join the body of the message
    telegramMessage += messageInfo.join("\n")

    // added datetime info
    telegramMessage += "\n\n-----------------------------------------------------\n" +
        `<b>Created At</b>: ${new Date(req.body.createdAt).toLocaleString()} ` + "\n" +
        `<b>Updated At</b>: ${new Date(req.body.updatedAt).toLocaleString()} `;

    // end request 200
    res.end();

    // post data to Telegram bot
    request(`https://api.telegram.org/bot${telegramBotAPIKey}/sendMessage`,{
        method: 'post',
        json: true,
        body: {
            chat_id: telegramChatID,
            text: telegramMessage,
            parse_mode: 'HTML'
        }
    }, (error, response) => {
        console.log(response.body)
    })
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
