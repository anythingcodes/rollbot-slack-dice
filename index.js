'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Expression = require('./expression');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = app.listen(process.env.PORT, () => { console.log('Express server listening on port %d in %s mode', server.address().port,   app.settings.env);});

app.post('/roll', (req, res) => {
  const text = req.body.text;
  const error = false; // TODO: Error Detection
  
  if(error) {
    res.send('Hm, looks like your parentheses weren\'t balanced. Roll again!');
  }

  const segments = text.split(/(?=[+-])/).reduce((previous, segment) => {
    previous.push(segment.replace(/\s/g,''));
    return previous;
  }, []);

  const lhs = []; // output for the left-hand side of the equation
  const expressionValues = segments.map(segment => {
    const rollFactors = segment.split("d");
    if(segment.includes("d")) {
      if(segment.indexOf("d") === 0) {
        // first value is 1
        const rollSegment = Math.floor(Math.random()*rollFactors[1]+1);
        lhs.push(rollSegment);
        return rollSegment;
      }
      const factor = rollFactors[0];
      const faces = rollFactors[1];
      const rollSegments = rollMultiple(factor, faces);
      lhs.push(rollSegments);
      return sumRolls(rollSegments);
    } else {
      lhs.push(segment);
    }
    return segment;
  });

  const lhsOutput = lhs.map(item => {
    if(Array.isArray(item)) {
      if(item.length > 1) {
        return `(${item.join(" + ")}) `;
      }
      return `${item[0]} `.replace('+', '');
    }
    return `${item} `.replace('+', '');
  });

  const rhs = sumRolls(expressionValues);
  const output = `You rolled *${rhs}* ${expressionValues.length === 1 ? '' : `\n>_Rolls:_ ${lhsOutput.join("+ ")}`}`;

  let data = {
    response_type: !!req.query.private ? 'ephemeral' : 'in_channel',
    text: output
  };
  res.json(data);
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