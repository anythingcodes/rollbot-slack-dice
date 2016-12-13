"use strict";
require('babel-register');

class DiceRoll {
  constructor(dice) {
      this.dice = dice;
      this.total = 0;
      this.result = [];
  }
};

module.exports = DiceRoll;

const input = "d20 - 3";

// TODO: Error handling for text

const text = stripWhitespace(input);
if(text.length === 0) {
    throw new Error('Sorry, you need to enter some text');
}

const result = text.split(/(?=[+-])/).reduce((prev, item) => {
    item = stripWhitespace(item);
if(isDiceRoll(item)) {
    // TODO: negative test
    const [ factor, faces ] = item.split('d');
    const rolls = roll((!!factor ? factor : 1), faces);
    prev.total += getRollSum(rolls);
    prev.rolls.push(rolls);
}
else if(isNumeric(item)) {
    // TODO: negative test
    try {
        item = parseInt(item);
        prev.rolls.push(item);
        prev.total += item;
    }
    catch(error) {
        //res.status(500);
        console.err(`Error: ${error}`);
    }
}
return prev;
}, { total: 0, rolls: [] });

console.log(`DICE: ${input}`);
console.log(`RESULT: ${formatRolls(result.rolls)}`);
console.log(`TOTAL: ${result.total}`);

function stripWhitespace(term) {
    return term.replace(/\s/g,'');
}

function isDiceRoll(n) {
    const pattern = new RegExp(/^[\+\-+]?[\d+]?[\d+]?d\d+[\+|\-]?\d*$/);
    return pattern.test(n);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function roll(strFactor, strFaces) {
    const factor = parseInt(strFactor);
    const faces = parseInt(strFaces);
    return Array.from({length: Math.abs(factor)}, () => {
            const retVal = Math.floor(Math.random() * faces + 1);
    return factor < 0 ? -1 * retVal : retVal;
});
}

function formatRolls(lhs) {
    return lhs.map(item => {
            if(Array.isArray(item)) {
        if(item.length > 1) {
            return `(${item.join(" + ")}) `;
        }
        return `${item[0]} `.replace('+', '');
    }
    return `${item} `.replace('+', '');
}).join("+ ");
}

function getRollSum(arr) {
    return arr.reduce((sum, number) => {
            return sum + number;
}, 0);
}