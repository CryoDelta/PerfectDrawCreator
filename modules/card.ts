import { Effect } from "./effect.js";
import { Keyword } from "./keyword.js";
import { Strength, textToStrength } from "./strength.js";

class Card {
    private _name : string;
    private _imgPath : string;
    private _keywords : Array<Keyword>;
    private _effect : Effect;
    private _gimmicky : boolean;
    private _consistent : boolean;
    protected _ep : number;

    constructor(name : string, imgPath : string) {
        this._name = name;
        this._imgPath = imgPath;
        this._keywords = new Array<Keyword>();
        this._gimmicky = false;
        this._consistent = false;
        this._ep = 0;
    }

    public addKeyword(keyword : Keyword) : void{
        this._keywords.push(keyword);
    }

    public setEffect(effect : Effect) : void{
        this._effect = effect;
    }

    public switchGimmicky() : void{
        this._gimmicky= !this._gimmicky;
    }

    public switchConsistent() : void{
        this._consistent= !this._consistent;
    }

    public getHTML() : HTMLElement {
        let HTMLCard = document.createElement('div');
        HTMLCard.id = 'card';

        let HTMLName = document.createElement('h2');
        HTMLName.textContent = this._name;
        HTMLCard.append(HTMLName);

        let HTMLImage = document.createElement('img');
        HTMLImage.setAttribute('alt', this._name);
        HTMLCard.append(HTMLImage);

        let HTMLKeywords = document.createElement('div');
        this._keywords.forEach(keyword => {
            HTMLKeywords.append(keyword.getHTML());
        });
        HTMLCard.append(HTMLKeywords);

        let HTMLEffect = document.createElement('p');
        if(this._effect) {
            HTMLEffect.textContent += this._effect.getText().charAt(0).toUpperCase() + this._effect.getText().slice(1) + '.';
        }
        HTMLCard.append(HTMLEffect);

        return HTMLCard;
    }

    public getEp() : number {
        let ep : number = this._ep;
        this._keywords.forEach(keyword => {
            ep += keyword.getEp();
        });
        if(this._effect) {
            ep += this._effect.getEP();
        }
        if(this._consistent) {
            ep--;
        }
        if(this._gimmicky) {
            ep++;
        }
        return ep;
    }
}

export class Warrior extends Card{
    private _strength : Strength;

    constructor(name : string, strength : Strength, imgPath : string) {
        super(name, imgPath);
        this._strength = strength;
        switch (this._strength) {
            case Strength.WEAK:
                this._ep = 3;
                break;
            case Strength.NORMAL:
                this._ep = 2;
                break;
            case Strength.STRONG:
                this._ep = 0;
                break;
        }
    }

    public getHTML() : HTMLElement{
        let HTMLCard = super.getHTML();

        let HTMLType = document.createElement('span');
        switch (this._strength) {
            case Strength.WEAK:
                HTMLType.textContent = 'Weak';
                break;
            case Strength.NORMAL:
                HTMLType.textContent = 'Normal';
                break;
            case Strength.STRONG:
                HTMLType.textContent = 'Strong';
                break;
        }
        HTMLType.textContent += ' Warrior';
        HTMLCard.append(HTMLType);

        return HTMLCard;
    }
}

export class Item extends Card{
    private _strength : Strength;

    constructor(name : string, strength : Strength, imgPath : string) {
        super(name, imgPath);
        this._strength = strength;
        switch (this._strength) {
            case Strength.WEAK:
                this._ep = 4;
                break;
            case Strength.NORMAL:
                this._ep = 3;
                break;
            case Strength.STRONG:
                this._ep = 1;
                break;
        }
    }

    public getHTML() : HTMLElement{
        let HTMLCard = super.getHTML();

        let HTMLType = document.createElement('span');
        switch (this._strength) {
            case Strength.WEAK:
                HTMLType.textContent = 'Weak';
                break;
            case Strength.NORMAL:
                HTMLType.textContent = 'Normal';
                break;
            case Strength.STRONG:
                HTMLType.textContent = 'Strong';
                break;
        }
        HTMLType.textContent += ' Item';
        HTMLCard.append(HTMLType);

        return HTMLCard;
    }
}

export class Invocation extends Card{
    constructor(name : string, imgPath : string) {
        super(name, imgPath);
        this._ep = 3;
    }

    public getHTML() : HTMLElement{
        let HTMLCard = super.getHTML();

        let HTMLType = document.createElement('span');
        HTMLType.textContent += 'Invocation';
        HTMLCard.append(HTMLType);

        return HTMLCard;
    }
}

export function cardFactory(name : string, strength : string, type : string, imgPath : string) : Card{
    switch (type) {
        case 'warrior':
            return new Warrior(name, textToStrength(strength), imgPath);
        case 'item':
            return new Item(name, textToStrength(strength), imgPath);
        case 'invocation':
            return new Invocation(name, imgPath);
    }
}