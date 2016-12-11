"use strict";
class Expression {
    constructor(text) {
        this.text = text;
        this.segments = [];
        this.result = 0;
    }
    getSegments() {
        return this.text.split(/(?=[+-])/);
    }
    resolveDiceRolls() {
        const calculation = this.segments.map(segment => {
            segment.trim();
            console.log('===segment');
            console.log(segment);
            const rollFactors = segment.split("d");
            console.log('===rollFactors');
            console.log(rollFactors);
            if(segment.includes("d")) {
                if(segment.indexOf("d") === 0) {
                    // first value is 1
                    this.calculateRoll(1, rollFactors[0]);
                } else {
                    const factor = rollFactors[0];
                    const faces = rollFactors[1];
                    return this.calculateRoll(factor, faces);
                }
            }
            return segment;
        });
        return calculation;
    }
    calculateRoll(factor, faces) {
        console.log(`calculateRoll of ${factor} factor and ${faces} faces`);
        return 0;
    }
}
module.exports = Expression;