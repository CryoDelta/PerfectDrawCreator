export enum Strength {
    WEAK = 0,
    NORMAL = 1,
    STRONG = 2
}

export function textToStrength(text : string) : Strength {
    switch (text) {
        case 'weak':
            return Strength.WEAK;
        case 'normal':
            return Strength.NORMAL;
        case 'strong':
            return Strength.STRONG;
    }
}