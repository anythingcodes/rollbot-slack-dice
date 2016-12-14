class DiceRoll {
    constructor(dice) {
        this.dice = dice;
        this.result = this.setResult(dice);
    }
    getTotal() {
        return this.result.total;
    }
    getDice() {
        return this.dice;
    }
    getRolls() {
        return this.formatRolls(this.result.rolls);
    }
    setResult() {
        return this.dice.split(/(?=[+-])/).reduce((p, i) => {
            const item = i.replace(/\s/g, ''); // strip whitespace
            const prev = p;
            if (this.isDiceRoll(item)) {
                // TODO: negative test
                const [factor, faces] = item.split('d');
                const rolls = this.roll((!factor ? 1 : factor), faces);
                prev.total += this.getRollSum(rolls);
                prev.rolls.push(rolls);
            } else if (this.isNumeric(item)) {
                // TODO: negative test
                const num = parseInt(item, 10);
                prev.rolls.push(num);
                prev.total += num;
            }
            return prev;
        }, { total: 0, rolls: [] });
    }
    isDiceRoll(n) {
        const pattern = new RegExp(/^[\+\-+]?[\d+]?[\d+]?d\d+[\+|\-]?\d*$/);
        return pattern.test(n);
    }
    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    roll(strFactor, strFaces) {
        const factor = parseInt(strFactor, 10);
        const faces = parseInt(strFaces, 10);
        return Array.from({ length: Math.abs(factor) }, () => {
            const retVal = Math.floor((Math.random() * faces) + 1);
            return factor < 0 ? -1 * retVal : retVal;
        });
    }
    formatRolls(lhs) {
        return lhs.map(item => { // eslint-disable-line arrow-parens
            if (Array.isArray(item)) {
                if (item.length > 1) {
                    return `(${item.join(' + ')}) `;
                }
                return `${item[0]} `.replace('+', '');
            }
            return `${item} `.replace('+', '');
        }).join('+ ');
    }
    getRollSum(arr) {
        return arr.reduce((sum, number) => sum + number, 0);
    }
}

module.exports = DiceRoll;
