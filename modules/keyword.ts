import { Effect } from "./effect.js";

export class Keyword {
    private _name : string;
    private _effect : Effect;
    private _number : number;

    constructor(name : string, effect : Effect) {
        this._name = name;
        this._effect = effect;
        this._number = 1;
    }

    public setNumber(number : number) : void {
        this._number = number;
    }

    public getHTML() : HTMLSpanElement {
        let HTMLKeyword = document.createElement('span');
        HTMLKeyword.textContent = '{' + this._name + '}' + ((this._number == 1) ? '' : ('[' + this._number + ']'));
        return HTMLKeyword;
    }

    public getEp() : number {
        return this._effect.getEP() * this._number;
    }
}

var keywords = {
    "ace" : new Keyword('Ace', new Effect("A unique card around which you strategy is built", 1)),
    "overwork" : new Keyword('Overwork', new Effect("When you play a card from your hand with {Overwork}, you cannot play a card from your hand as part of your actions next turn.\nSimilarly, if you play a staple with {Overwork}, you cannot play a staple as part of your actions next turn.", 1)),
    "overwhelm" : new Keyword('Overwhelm', new Effect("When a warrior or item with {Overwhelm} would Decide the Outcome of a Clash, it always wins.", -1)),
    "piercer" : new Keyword('Piercer', new Effect("When this warrior with {Piercer} [x] defeats another warrior or item in battle, it deals [x] damage to that warrior’s controller.", 1)),
    "teamwork" : new Keyword('Teamwork', new Effect("When a warrior with {Teamwork} attacks, it can attack alongside any number of other warriors that also have {Teamwork} and up to one warrior that doesn’t. When in a pool of this kind, two {Weak} warriors attack as if they were a {Normal} warrior, and two {Normal} warriors or four {Weak} warriors can attack as if they were a {Strong} warrior, and so on.\nAny attacking based effects (such as {Overwhelm} or {Piercer}) are gained from warriors with {Teamwork}.", -1)),
    "followup" : new Keyword('Followup', new Effect("When you play a card with {Followup}, you may play an additional card from your hand this turn.", -1)),
    "pressure" : new Keyword('Pressure', new Effect("While a card with {Pressure} [x] is on the battlefield, you roll with an additional+[x] whenever you roll+your Tension. Invocations that give {Pressure} [x] may specify how long the effect lasts for.", -1)),
    "strengthened" : new Keyword('Strengthened', new Effect("When a warrior or item is {Strengthened}, its strength tier goes up by one (from {Weak} to {Normal}, or {Normal} to {Strong}. If a {Strong} card is {Strengthened}, instead give it {Overwhelm} while it remains {Strengthened}", -1)),
    "underwhelm" : new Keyword('Underwhelm', new Effect("When a warrior or item with {Underwhelm} would Decide the Outcome of a Clash, it always loses.", 1)),
    "sniper" : new Keyword('Sniper', new Effect("When this warrior with {Sniper} [x] attacks a player directly, it deals [x] extra damage.", -1)),
    "inconspicuous" : new Keyword('Inconspicuous', new Effect("A warrior or item with {Inconspicuous} cannot be the target of attacks from opponents’ warriors unless it is the only possible non-player target.", -1)),
    "blocker" : new Keyword('Blocker', new Effect("When another warrior or item is attacked, a warrior or item with {Blocker} can intercept, redirecting the attack to them instead.", -1)),
    "fumble" : new Keyword('Fumble', new Effect("When you {Fumble} an opponent, describe a specific action they could take, a type of card they could play, or a kind of game action they could perform. Once between now and your next turn, If the opponent does as you said, players may Counter Your Opponent’s Play and NPCs may Use a Response Move without spending advantage or using their limited response moves.", 1)),
}

export function keywordFactory(key : string) : Keyword {
    if(key.split('_').length == 1) {
        return keywords[key];
    }
    let keyword = keywords[key.split('_')[0]];
    keyword.setNumber(parseInt(key.split('_')[1]));
    return keyword;
}