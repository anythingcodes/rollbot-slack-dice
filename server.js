const fetch = require('isomorphic-fetch');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const DiceRoll = require('./includes/diceRoll');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===========
// SERVER
// This runs every 5 minutes to prevent Heroku from making this app go to sleep
// ===========
const keepAlive = () => {
    fetch('http://rollbot-slack.herokuapp.com/')
        .then(() => console.log('Successfully fetched from Heroku instance')) // eslint-disable-line no-console
        .catch(() => console.log('Error fetching from Heroku instance')); // eslint-disable-line no-console
};
const port = !process.env.PORT ? 8765 : process.env.PORT;
const server = app.listen(port, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env); // eslint-disable-line no-console
    setInterval(keepAlive, 300000);
});

// ===========
// ROUTES
// ===========
app.get('/', (req, res) => {
    res.status(200).send('Server running');
});

app.post('/roll', (req, res) => {
    const { text, user_name } = req.body;
    // TODO: Verify Slack token
    try {
        if (!text) {
            throw new Error('Oops, no roll entered. Roll again!');
        }
        const diceRoll = new DiceRoll(text);
        const fallback = `@${user_name} rolled *${diceRoll.getTotal()}*`; // eslint-disable-line camelcase
        const slackResponse = {
            response_type: 'in_channel',
            attachments: [
                {
                    fallback,
                    color: 'good', // TODO: Change color based on max and min roll values
                    pretext: fallback,
                    fields: [
                        {
                            title: 'Dice',
                            value: diceRoll.getDice(),
                            short: false
                        },
                        {
                            title: 'Rolls',
                            value: diceRoll.getRolls(),
                            short: true
                        },
                        {
                            title: 'Result',
                            value: diceRoll.getTotal(),
                            short: true
                        }
                    ],
                    mrkdwn_in: ['pretext']
                }
            ]
        };
        res.json(slackResponse);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
