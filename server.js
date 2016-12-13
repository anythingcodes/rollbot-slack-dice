require('babel-register');
require("isomorphic-fetch");

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const DiceRoll = require('./classes/diceRoll');
const diceRegex = new RegExp(/^[\+\-+]?[\d+]?d\d+[\+|\-]?\d*$/);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This runs every 5 minutes to prevent Heroku from making this app go to sleep
function keepAlive() {
  fetch('http://rollbot-slack.herokuapp.com/')
      .then(response => console.log('Successfully fetched from Heroku instance'))
      .catch(error => console.log('Error fetching from Heroku instance'));
}
const port = !process.env.PORT ? 8765 : process.env.PORT;
const server = app.listen(port, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
  setInterval(keepAlive, 300000);
});

app.post('/roll', (req, res) => {
    const text = req.body.text;
    const diceRoll = new DiceRoll(text);
    console.log(diceRoll.dice);
    console.log(diceRoll.total);
    console.log(diceRoll.result);

  // const text = req.body.text;
  // const user_name = req.body.user_name;
  // const error = false; // TODO: Error Detection
  //
  // if(error) {
  //   res.send('Hm, looks like your parentheses weren\'t balanced. Roll again!');
  // }
  //
  // const segments = text.split(/(?=[+-])/).reduce((previous, segment) => {
  //   previous.push(segment.replace(/\s/g,''));
  //   return previous;
  // }, []);
  //
  // const lhs = []; // output for the left-hand side of the equation
  // const expressionValues = segments.map(segment => {
  //   const rollFactors = segment.split("d");
  //   console.log('==is dice roll?');
  //   console.log(segment);
  //   console.log(isDiceRoll(segment));
  //   if(segment.includes("d")) {
  //     if(segment.indexOf("d") === 0) {
  //       // first value is 1
  //       const rollSegment = Math.floor(Math.random()*rollFactors[1]+1);
  //       lhs.push(rollSegment);
  //       return rollSegment;
  //     }
  //     const factor = rollFactors[0];
  //     const faces = rollFactors[1];
  //     const rollSegments = rollMultiple(factor, faces);
  //     lhs.push(rollSegments);
  //     return sumRolls(rollSegments);
  //   } else {
  //     lhs.push(segment);
  //   }
  //   return segment;
  // });
  //
  // const lhsOutput = lhs.map(item => {
  //   if(Array.isArray(item)) {
  //     if(item.length > 1) {
  //       return `(${item.join(" + ")}) `;
  //     }
  //     return `${item[0]} `.replace('+', '');
  //   }
  //   return `${item} `.replace('+', '');
  // });
  //
  // const rhs = sumRolls(expressionValues);

  /*let data = {
    response_type: !!req.query.private ? 'ephemeral' : 'in_channel',
    attachments: [
      {
        "fallback": "Required plain-text summary of the attachment.",
        "color": "good", // TODO: Change color based on max and min roll values
        "pretext": `@${user_name} rolled *${rhs}*`,
        "fields": [
      {
        "title": "Dice",
        "value": segments.join(" "),
        "short": false
      },
      {
        "title": "Rolls",
        "value": lhsOutput.join("+ "),
        "short": true
      },
      {
        "title": "Result",
        "value": rhs,
        "short": true
      }
    ],
        "mrkdwn_in": ["pretext"]
  }
  ]
  };
  res.json(data);*/
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

function rollMultiple(factor, faces) {
  if(factor < 0) {
    return Array.from({length: Math.abs(factor)}, () => -Math.floor(Math.random()*faces+1));
  }
  return Array.from({length: Math.abs(factor)}, () => Math.floor(Math.random()*faces+1));
}

function sumRolls(rollArr) {
  return rollArr.reduce((sum, number) => {
    return sum + parseInt(number);
  }, 0);
}

function isDiceRoll(val) {
  return diceRegex.test(val);
}