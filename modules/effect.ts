export class Effect {
    protected _text : string;
    protected _ep : number;

    constructor(text : string, ep : number) {
        this._text = text;
        this._ep = ep;
    }

    public getText() : string {
        return this._text;
    }

    public setText(text : string) {
        this._text = text;
    }

    public getEP() : number {
        return this._ep;
    }
}