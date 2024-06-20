(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_js_1 = require("./modules/card.js");
const effect_js_1 = require("./modules/effect.js");
const keyword_js_1 = require("./modules/keyword.js");
const strength_js_1 = require("./modules/strength.js");
const html_to_image_1 = require("html-to-image");
let HTMLVisualisation = document.getElementById('visualisation');
let card = new card_js_1.Warrior('', strength_js_1.Strength.WEAK, '');
HTMLVisualisation.append(card.getHTML());
let HTMLDownloadImage = document.getElementById('actions').getElementsByTagName('a')[0];
// Type and strength management
let HTMLTypeField = document.getElementById('type');
let HTMLStrengthField = document.getElementById('strength');
let HTMLType = HTMLTypeField.getElementsByTagName('select')[0];
HTMLType.addEventListener('change', () => {
    if (HTMLType.value == 'warrior' || HTMLType.value == 'item') {
        HTMLStrengthField.style.display = '';
    }
    else {
        HTMLStrengthField.style.display = 'none';
    }
});
// Keywords management
let HTMLKeywordField = document.getElementById('keywords');
let HTMLKeywordSelect = HTMLKeywordField.getElementsByTagName('select')[0];
let HTMLKeywords = HTMLKeywordField.getElementsByTagName('div')[0];
HTMLKeywordSelect.addEventListener('change', () => {
    // Check if the keyword is already in the selected list
    let HTMLKeyword = null;
    Array.from(HTMLKeywords.getElementsByTagName('button')).forEach(button => {
        if (button.getAttribute('data-value').split('_')[0] == HTMLKeywordSelect.value) {
            HTMLKeyword = button;
        }
    });
    if (HTMLKeyword) {
        // If it's in the list, append '_X' to it with 'X' being the number or times it's been selected
        if (HTMLKeyword.getAttribute('data-value').split('_').length == 1) {
            HTMLKeyword.setAttribute('data-value', HTMLKeyword.getAttribute('data-value') + '_2');
            HTMLKeyword.textContent += ' 2';
        }
        else {
            HTMLKeyword.setAttribute('data-value', HTMLKeyword.getAttribute('data-value').split('_')[0] + '_' + (parseInt(HTMLKeyword.getAttribute('data-value').split('_')[1]) + 1));
            HTMLKeyword.textContent = HTMLKeyword.textContent.split(' ')[0] + ' ' + parseInt(HTMLKeyword.getAttribute('data-value').split('_')[1]);
        }
    }
    else {
        // Otherwise, create it and add it to the list
        HTMLKeyword = document.createElement('button');
        HTMLKeyword.setAttribute('data-value', HTMLKeywordSelect.value);
        HTMLKeyword.textContent = HTMLKeywordSelect.options[HTMLKeywordSelect.selectedIndex].text;
        HTMLKeyword.classList.add('keyword');
        HTMLKeyword.addEventListener('click', () => {
            // Handles deletion
            if (HTMLKeyword.getAttribute('data-value').split('_').length == 1) {
                HTMLKeyword.outerHTML = '';
            }
            else if (HTMLKeyword.getAttribute('data-value').split('_')[1] == '2') {
                HTMLKeyword.setAttribute('data-value', HTMLKeyword.getAttribute('data-value').split('_')[0]);
                HTMLKeyword.textContent = HTMLKeyword.textContent.split(' ')[0];
            }
            else {
                HTMLKeyword.setAttribute('data-value', HTMLKeyword.getAttribute('data-value').split('_')[0] + '_' + (parseInt(HTMLKeyword.getAttribute('data-value').split('_')[1]) - 1));
                HTMLKeyword.textContent = HTMLKeyword.textContent.split(' ')[0] + ' ' + parseInt(HTMLKeyword.getAttribute('data-value').split('_')[1]);
            }
            updateCard();
        });
        HTMLKeywords.append(HTMLKeyword);
    }
    HTMLKeywordSelect.value = 'default';
});
// Effect management
let HTMLEffectField = document.getElementById('effect');
let HTMLCost = HTMLEffectField.children[1].getElementsByTagName('input')[0];
let HTMLPlus = document.getElementById('plus');
HTMLPlus.addEventListener('click', () => {
    HTMLCost.value = (parseInt(HTMLCost.value) + 1).toString();
    updateCard();
});
let HTMLMinus = document.getElementById('minus');
HTMLMinus.addEventListener('click', () => {
    if (HTMLCost.value != '0') {
        HTMLCost.value = (parseInt(HTMLCost.value) - 1).toString();
    }
    updateCard();
});
// All fields
let HTMLInputs = document.getElementsByTagName('input');
let HTMLForm = [
    HTMLInputs[0],
    HTMLType,
    HTMLStrengthField.getElementsByTagName('select')[0],
    HTMLInputs[1],
    HTMLKeywordSelect,
    document.getElementsByTagName('textarea')[0],
    HTMLCost,
    HTMLInputs[3],
    HTMLInputs[4]
];
function updateCard() {
    HTMLVisualisation.children[1].outerHTML = '';
    card = (0, card_js_1.cardFactory)(HTMLForm[0].value, HTMLForm[2].value, HTMLForm[1].value, HTMLForm[3].value);
    Array.from(HTMLKeywords.getElementsByTagName('button')).forEach(HTMLKeyword => {
        card.addKeyword((0, keyword_js_1.keywordFactory)(HTMLKeyword.getAttribute('data-value')));
    });
    if (HTMLForm[5].value != '') {
        card.setEffect(new effect_js_1.Effect(HTMLForm[5].value, parseInt(HTMLForm[6].value) * -1));
    }
    if (HTMLForm[7].checked) {
        card.switchGimmicky();
    }
    if (HTMLForm[8].checked) {
        card.switchConsistent();
    }
    HTMLVisualisation.append(card.getHTML());
    let HTMLCard = document.getElementById('card');
    let HTMLImage = HTMLVisualisation.getElementsByTagName('img')[0];
    if (HTMLForm[3].files.length == 0) {
        HTMLImage.src = './assets/placeholder.png';
        let HTMLCard = document.getElementById('card');
        (0, html_to_image_1.toPng)(HTMLCard).then(function (dataURL) {
            HTMLDownloadImage.href = dataURL;
        }).catch(function (error) {
            console.error(error);
        });
    }
    else {
        let reader = new FileReader();
        reader.onload = (e) => {
            HTMLImage.src = e.target.result;
            (0, html_to_image_1.toPng)(HTMLCard).then(function (dataURL) {
                HTMLDownloadImage.href = dataURL;
            }).catch(function (error) {
                console.error(error);
            });
        };
        reader.readAsDataURL(HTMLForm[3].files[0]);
    }
    console.log(card);
    document.getElementById('ep').textContent = card.getEp().toString();
}
HTMLForm.forEach(HTMLField => {
    HTMLField.addEventListener('change', updateCard);
});

},{"./modules/card.js":3,"./modules/effect.js":4,"./modules/keyword.js":5,"./modules/strength.js":6,"html-to-image":14}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardFactory = exports.Invocation = exports.Item = exports.Warrior = void 0;
const strength_js_1 = require("./strength.js");
class Card {
    constructor(name, imgPath) {
        this._name = name;
        this._imgPath = imgPath;
        this._keywords = new Array();
        this._gimmicky = false;
        this._consistent = false;
        this._ep = 0;
    }
    addKeyword(keyword) {
        this._keywords.push(keyword);
    }
    setEffect(effect) {
        this._effect = effect;
    }
    switchGimmicky() {
        this._gimmicky = !this._gimmicky;
    }
    switchConsistent() {
        this._consistent = !this._consistent;
    }
    getHTML() {
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
        if (this._effect) {
            HTMLEffect.textContent += this._effect.getText().charAt(0).toUpperCase() + this._effect.getText().slice(1) + '.';
        }
        HTMLCard.append(HTMLEffect);
        return HTMLCard;
    }
    getEp() {
        let ep = this._ep;
        this._keywords.forEach(keyword => {
            ep += keyword.getEp();
        });
        if (this._effect) {
            ep += this._effect.getEP();
        }
        if (this._consistent) {
            ep--;
        }
        if (this._gimmicky) {
            ep++;
        }
        return ep;
    }
}
class Warrior extends Card {
    constructor(name, strength, imgPath) {
        super(name, imgPath);
        this._strength = strength;
        switch (this._strength) {
            case strength_js_1.Strength.WEAK:
                this._ep = 3;
                break;
            case strength_js_1.Strength.NORMAL:
                this._ep = 2;
                break;
            case strength_js_1.Strength.STRONG:
                this._ep = 0;
                break;
        }
    }
    getHTML() {
        let HTMLCard = super.getHTML();
        let HTMLType = document.createElement('span');
        switch (this._strength) {
            case strength_js_1.Strength.WEAK:
                HTMLType.textContent = 'Weak';
                break;
            case strength_js_1.Strength.NORMAL:
                HTMLType.textContent = 'Normal';
                break;
            case strength_js_1.Strength.STRONG:
                HTMLType.textContent = 'Strong';
                break;
        }
        HTMLType.textContent += ' Warrior';
        HTMLCard.append(HTMLType);
        return HTMLCard;
    }
}
exports.Warrior = Warrior;
class Item extends Card {
    constructor(name, strength, imgPath) {
        super(name, imgPath);
        this._strength = strength;
        switch (this._strength) {
            case strength_js_1.Strength.WEAK:
                this._ep = 4;
                break;
            case strength_js_1.Strength.NORMAL:
                this._ep = 3;
                break;
            case strength_js_1.Strength.STRONG:
                this._ep = 1;
                break;
        }
    }
    getHTML() {
        let HTMLCard = super.getHTML();
        let HTMLType = document.createElement('span');
        switch (this._strength) {
            case strength_js_1.Strength.WEAK:
                HTMLType.textContent = 'Weak';
                break;
            case strength_js_1.Strength.NORMAL:
                HTMLType.textContent = 'Normal';
                break;
            case strength_js_1.Strength.STRONG:
                HTMLType.textContent = 'Strong';
                break;
        }
        HTMLType.textContent += ' Item';
        HTMLCard.append(HTMLType);
        return HTMLCard;
    }
}
exports.Item = Item;
class Invocation extends Card {
    constructor(name, imgPath) {
        super(name, imgPath);
        this._ep = 3;
    }
    getHTML() {
        let HTMLCard = super.getHTML();
        let HTMLType = document.createElement('span');
        HTMLType.textContent += 'Invocation';
        HTMLCard.append(HTMLType);
        return HTMLCard;
    }
}
exports.Invocation = Invocation;
function cardFactory(name, strength, type, imgPath) {
    switch (type) {
        case 'warrior':
            return new Warrior(name, (0, strength_js_1.textToStrength)(strength), imgPath);
        case 'item':
            return new Item(name, (0, strength_js_1.textToStrength)(strength), imgPath);
        case 'invocation':
            return new Invocation(name, imgPath);
    }
}
exports.cardFactory = cardFactory;

},{"./strength.js":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effect = void 0;
class Effect {
    constructor(text, ep) {
        this._text = text;
        this._ep = ep;
    }
    getText() {
        return this._text;
    }
    setText(text) {
        this._text = text;
    }
    getEP() {
        return this._ep;
    }
}
exports.Effect = Effect;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keywordFactory = exports.Keyword = void 0;
const effect_js_1 = require("./effect.js");
class Keyword {
    constructor(name, effect) {
        this._name = name;
        this._effect = effect;
        this._number = 1;
    }
    setNumber(number) {
        this._number = number;
    }
    getHTML() {
        let HTMLKeyword = document.createElement('span');
        HTMLKeyword.textContent = '{' + this._name + '}' + ((this._number == 1) ? '' : ('[' + this._number + ']'));
        return HTMLKeyword;
    }
    getEp() {
        return this._effect.getEP() * this._number;
    }
}
exports.Keyword = Keyword;
var keywords = {
    "ace": new Keyword('Ace', new effect_js_1.Effect("A unique card around which you strategy is built", 1)),
    "overwork": new Keyword('Overwork', new effect_js_1.Effect("When you play a card from your hand with {Overwork}, you cannot play a card from your hand as part of your actions next turn.\nSimilarly, if you play a staple with {Overwork}, you cannot play a staple as part of your actions next turn.", 1)),
    "overwhelm": new Keyword('Overwhelm', new effect_js_1.Effect("When a warrior or item with {Overwhelm} would Decide the Outcome of a Clash, it always wins.", -1)),
    "piercer": new Keyword('Piercer', new effect_js_1.Effect("When this warrior with {Piercer} [x] defeats another warrior or item in battle, it deals [x] damage to that warriorÔÇÖs controller.", 1)),
    "teamwork": new Keyword('Teamwork', new effect_js_1.Effect("When a warrior with {Teamwork} attacks, it can attack alongside any number of other warriors that also have {Teamwork} and up to one warrior that doesnÔÇÖt. When in a pool of this kind, two {Weak} warriors attack as if they were a {Normal} warrior, and two {Normal} warriors or four {Weak} warriors can attack as if they were a {Strong} warrior, and so on.\nAny attacking based effects (such as {Overwhelm} or {Piercer}) are gained from warriors with {Teamwork}.", -1)),
    "followup": new Keyword('Followup', new effect_js_1.Effect("When you play a card with {Followup}, you may play an additional card from your hand this turn.", -1)),
    "pressure": new Keyword('Pressure', new effect_js_1.Effect("While a card with {Pressure} [x] is on the battlefield, you roll with an additional+[x] whenever you roll+your Tension. Invocations that give {Pressure} [x] may specify how long the effect lasts for.", -1)),
    "strengthened": new Keyword('Strengthened', new effect_js_1.Effect("When a warrior or item is {Strengthened}, its strength tier goes up by one (from {Weak} to {Normal}, or {Normal} to {Strong}. If a {Strong} card is {Strengthened}, instead give it {Overwhelm} while it remains {Strengthened}", -1)),
    "underwhelm": new Keyword('Underwhelm', new effect_js_1.Effect("When a warrior or item with {Underwhelm} would Decide the Outcome of a Clash, it always loses.", 1)),
    "sniper": new Keyword('Sniper', new effect_js_1.Effect("When this warrior with {Sniper} [x] attacks a player directly, it deals [x] extra damage.", -1)),
    "inconspicuous": new Keyword('Inconspicuous', new effect_js_1.Effect("A warrior or item with {Inconspicuous} cannot be the target of attacks from opponentsÔÇÖ warriors unless it is the only possible non-player target.", -1)),
    "blocker": new Keyword('Blocker', new effect_js_1.Effect("When another warrior or item is attacked, a warrior or item with {Blocker} can intercept, redirecting the attack to them instead.", -1)),
    "fumble": new Keyword('Fumble', new effect_js_1.Effect("When you {Fumble} an opponent, describe a specific action they could take, a type of card they could play, or a kind of game action they could perform. Once between now and your next turn, If the opponent does as you said, players may Counter Your OpponentÔÇÖs Play and NPCs may Use a Response Move without spending advantage or using their limited response moves.", 1)),
};
function keywordFactory(key) {
    if (key.split('_').length == 1) {
        return keywords[key];
    }
    let keyword = keywords[key.split('_')[0]];
    keyword.setNumber(parseInt(key.split('_')[1]));
    return keyword;
}
exports.keywordFactory = keywordFactory;

},{"./effect.js":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToStrength = exports.Strength = void 0;
var Strength;
(function (Strength) {
    Strength[Strength["WEAK"] = 0] = "WEAK";
    Strength[Strength["NORMAL"] = 1] = "NORMAL";
    Strength[Strength["STRONG"] = 2] = "STRONG";
})(Strength || (exports.Strength = Strength = {}));
function textToStrength(text) {
    switch (text) {
        case 'weak':
            return Strength.WEAK;
        case 'normal':
            return Strength.NORMAL;
        case 'strong':
            return Strength.STRONG;
    }
}
exports.textToStrength = textToStrength;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStyle = void 0;
function applyStyle(node, options) {
    var style = node.style;
    if (options.backgroundColor) {
        style.backgroundColor = options.backgroundColor;
    }
    if (options.width) {
        style.width = "".concat(options.width, "px");
    }
    if (options.height) {
        style.height = "".concat(options.height, "px");
    }
    var manual = options.style;
    if (manual != null) {
        Object.keys(manual).forEach(function (key) {
            style[key] = manual[key];
        });
    }
    return node;
}
exports.applyStyle = applyStyle;

},{}],8:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneNode = void 0;
var clone_pseudos_1 = require("./clone-pseudos");
var util_1 = require("./util");
var mimes_1 = require("./mimes");
var dataurl_1 = require("./dataurl");
function cloneCanvasElement(canvas) {
    return __awaiter(this, void 0, void 0, function () {
        var dataURL;
        return __generator(this, function (_a) {
            dataURL = canvas.toDataURL();
            if (dataURL === 'data:,') {
                return [2 /*return*/, canvas.cloneNode(false)];
            }
            return [2 /*return*/, (0, util_1.createImage)(dataURL)];
        });
    });
}
function cloneVideoElement(video, options) {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, ctx, dataURL_1, poster, contentType, dataURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (video.currentSrc) {
                        canvas = document.createElement('canvas');
                        ctx = canvas.getContext('2d');
                        canvas.width = video.clientWidth;
                        canvas.height = video.clientHeight;
                        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        dataURL_1 = canvas.toDataURL();
                        return [2 /*return*/, (0, util_1.createImage)(dataURL_1)];
                    }
                    poster = video.poster;
                    contentType = (0, mimes_1.getMimeType)(poster);
                    return [4 /*yield*/, (0, dataurl_1.resourceToDataURL)(poster, contentType, options)];
                case 1:
                    dataURL = _a.sent();
                    return [2 /*return*/, (0, util_1.createImage)(dataURL)];
            }
        });
    });
}
function cloneIFrameElement(iframe) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    if (!((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) return [3 /*break*/, 2];
                    return [4 /*yield*/, cloneNode(iframe.contentDocument.body, {}, true)];
                case 1: return [2 /*return*/, (_c.sent())];
                case 2: return [3 /*break*/, 4];
                case 3:
                    _b = _c.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, iframe.cloneNode(false)];
            }
        });
    });
}
function cloneSingleNode(node, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ((0, util_1.isInstanceOfElement)(node, HTMLCanvasElement)) {
                return [2 /*return*/, cloneCanvasElement(node)];
            }
            if ((0, util_1.isInstanceOfElement)(node, HTMLVideoElement)) {
                return [2 /*return*/, cloneVideoElement(node, options)];
            }
            if ((0, util_1.isInstanceOfElement)(node, HTMLIFrameElement)) {
                return [2 /*return*/, cloneIFrameElement(node)];
            }
            return [2 /*return*/, node.cloneNode(false)];
        });
    });
}
var isSlotElement = function (node) {
    return node.tagName != null && node.tagName.toUpperCase() === 'SLOT';
};
function cloneChildren(nativeNode, clonedNode, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var children;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    children = [];
                    if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
                        children = (0, util_1.toArray)(nativeNode.assignedNodes());
                    }
                    else if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLIFrameElement) &&
                        ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
                        children = (0, util_1.toArray)(nativeNode.contentDocument.body.childNodes);
                    }
                    else {
                        children = (0, util_1.toArray)(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
                    }
                    if (children.length === 0 ||
                        (0, util_1.isInstanceOfElement)(nativeNode, HTMLVideoElement)) {
                        return [2 /*return*/, clonedNode];
                    }
                    return [4 /*yield*/, children.reduce(function (deferred, child) {
                            return deferred
                                .then(function () { return cloneNode(child, options); })
                                .then(function (clonedChild) {
                                if (clonedChild) {
                                    clonedNode.appendChild(clonedChild);
                                }
                            });
                        }, Promise.resolve())];
                case 1:
                    _c.sent();
                    return [2 /*return*/, clonedNode];
            }
        });
    });
}
function cloneCSSStyle(nativeNode, clonedNode) {
    var targetStyle = clonedNode.style;
    if (!targetStyle) {
        return;
    }
    var sourceStyle = window.getComputedStyle(nativeNode);
    if (sourceStyle.cssText) {
        targetStyle.cssText = sourceStyle.cssText;
        targetStyle.transformOrigin = sourceStyle.transformOrigin;
    }
    else {
        (0, util_1.toArray)(sourceStyle).forEach(function (name) {
            var value = sourceStyle.getPropertyValue(name);
            if (name === 'font-size' && value.endsWith('px')) {
                var reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
                value = "".concat(reducedFont, "px");
            }
            if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLIFrameElement) &&
                name === 'display' &&
                value === 'inline') {
                value = 'block';
            }
            if (name === 'd' && clonedNode.getAttribute('d')) {
                value = "path(".concat(clonedNode.getAttribute('d'), ")");
            }
            targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
        });
    }
}
function cloneInputValue(nativeNode, clonedNode) {
    if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLTextAreaElement)) {
        clonedNode.innerHTML = nativeNode.value;
    }
    if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLInputElement)) {
        clonedNode.setAttribute('value', nativeNode.value);
    }
}
function cloneSelectValue(nativeNode, clonedNode) {
    if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLSelectElement)) {
        var clonedSelect = clonedNode;
        var selectedOption = Array.from(clonedSelect.children).find(function (child) { return nativeNode.value === child.getAttribute('value'); });
        if (selectedOption) {
            selectedOption.setAttribute('selected', '');
        }
    }
}
function decorate(nativeNode, clonedNode) {
    if ((0, util_1.isInstanceOfElement)(clonedNode, Element)) {
        cloneCSSStyle(nativeNode, clonedNode);
        (0, clone_pseudos_1.clonePseudoElements)(nativeNode, clonedNode);
        cloneInputValue(nativeNode, clonedNode);
        cloneSelectValue(nativeNode, clonedNode);
    }
    return clonedNode;
}
function ensureSVGSymbols(clone, options) {
    return __awaiter(this, void 0, void 0, function () {
        var uses, processedDefs, i, use, id, exist, definition, _a, _b, nodes, ns, svg, defs, i;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    uses = clone.querySelectorAll ? clone.querySelectorAll('use') : [];
                    if (uses.length === 0) {
                        return [2 /*return*/, clone];
                    }
                    processedDefs = {};
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < uses.length)) return [3 /*break*/, 4];
                    use = uses[i];
                    id = use.getAttribute('xlink:href');
                    if (!id) return [3 /*break*/, 3];
                    exist = clone.querySelector(id);
                    definition = document.querySelector(id);
                    if (!(!exist && definition && !processedDefs[id])) return [3 /*break*/, 3];
                    // eslint-disable-next-line no-await-in-loop
                    _a = processedDefs;
                    _b = id;
                    return [4 /*yield*/, cloneNode(definition, options, true)];
                case 2:
                    // eslint-disable-next-line no-await-in-loop
                    _a[_b] = (_c.sent());
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    nodes = Object.values(processedDefs);
                    if (nodes.length) {
                        ns = 'http://www.w3.org/1999/xhtml';
                        svg = document.createElementNS(ns, 'svg');
                        svg.setAttribute('xmlns', ns);
                        svg.style.position = 'absolute';
                        svg.style.width = '0';
                        svg.style.height = '0';
                        svg.style.overflow = 'hidden';
                        svg.style.display = 'none';
                        defs = document.createElementNS(ns, 'defs');
                        svg.appendChild(defs);
                        for (i = 0; i < nodes.length; i++) {
                            defs.appendChild(nodes[i]);
                        }
                        clone.appendChild(svg);
                    }
                    return [2 /*return*/, clone];
            }
        });
    });
}
function cloneNode(node, options, isRoot) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!isRoot && options.filter && !options.filter(node)) {
                return [2 /*return*/, null];
            }
            return [2 /*return*/, Promise.resolve(node)
                    .then(function (clonedNode) { return cloneSingleNode(clonedNode, options); })
                    .then(function (clonedNode) { return cloneChildren(node, clonedNode, options); })
                    .then(function (clonedNode) { return decorate(node, clonedNode); })
                    .then(function (clonedNode) { return ensureSVGSymbols(clonedNode, options); })];
        });
    });
}
exports.cloneNode = cloneNode;

},{"./clone-pseudos":9,"./dataurl":10,"./mimes":15,"./util":16}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clonePseudoElements = void 0;
var util_1 = require("./util");
function formatCSSText(style) {
    var content = style.getPropertyValue('content');
    return "".concat(style.cssText, " content: '").concat(content.replace(/'|"/g, ''), "';");
}
function formatCSSProperties(style) {
    return (0, util_1.toArray)(style)
        .map(function (name) {
        var value = style.getPropertyValue(name);
        var priority = style.getPropertyPriority(name);
        return "".concat(name, ": ").concat(value).concat(priority ? ' !important' : '', ";");
    })
        .join(' ');
}
function getPseudoElementStyle(className, pseudo, style) {
    var selector = ".".concat(className, ":").concat(pseudo);
    var cssText = style.cssText
        ? formatCSSText(style)
        : formatCSSProperties(style);
    return document.createTextNode("".concat(selector, "{").concat(cssText, "}"));
}
function clonePseudoElement(nativeNode, clonedNode, pseudo) {
    var style = window.getComputedStyle(nativeNode, pseudo);
    var content = style.getPropertyValue('content');
    if (content === '' || content === 'none') {
        return;
    }
    var className = (0, util_1.uuid)();
    try {
        clonedNode.className = "".concat(clonedNode.className, " ").concat(className);
    }
    catch (err) {
        return;
    }
    var styleElement = document.createElement('style');
    styleElement.appendChild(getPseudoElementStyle(className, pseudo, style));
    clonedNode.appendChild(styleElement);
}
function clonePseudoElements(nativeNode, clonedNode) {
    clonePseudoElement(nativeNode, clonedNode, ':before');
    clonePseudoElement(nativeNode, clonedNode, ':after');
}
exports.clonePseudoElements = clonePseudoElements;

},{"./util":16}],10:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceToDataURL = exports.fetchAsDataURL = exports.makeDataUrl = exports.isDataUrl = void 0;
function getContentFromDataUrl(dataURL) {
    return dataURL.split(/,/)[1];
}
function isDataUrl(url) {
    return url.search(/^(data:)/) !== -1;
}
exports.isDataUrl = isDataUrl;
function makeDataUrl(content, mimeType) {
    return "data:".concat(mimeType, ";base64,").concat(content);
}
exports.makeDataUrl = makeDataUrl;
function fetchAsDataURL(url, init, process) {
    return __awaiter(this, void 0, void 0, function () {
        var res, blob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, init)];
                case 1:
                    res = _a.sent();
                    if (res.status === 404) {
                        throw new Error("Resource \"".concat(res.url, "\" not found"));
                    }
                    return [4 /*yield*/, res.blob()];
                case 2:
                    blob = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var reader = new FileReader();
                            reader.onerror = reject;
                            reader.onloadend = function () {
                                try {
                                    resolve(process({ res: res, result: reader.result }));
                                }
                                catch (error) {
                                    reject(error);
                                }
                            };
                            reader.readAsDataURL(blob);
                        })];
            }
        });
    });
}
exports.fetchAsDataURL = fetchAsDataURL;
var cache = {};
function getCacheKey(url, contentType, includeQueryParams) {
    var key = url.replace(/\?.*/, '');
    if (includeQueryParams) {
        key = url;
    }
    // font resource
    if (/ttf|otf|eot|woff2?/i.test(key)) {
        key = key.replace(/.*\//, '');
    }
    return contentType ? "[".concat(contentType, "]").concat(key) : key;
}
function resourceToDataURL(resourceUrl, contentType, options) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, dataURL, content, error_1, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
                    if (cache[cacheKey] != null) {
                        return [2 /*return*/, cache[cacheKey]];
                    }
                    // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
                    if (options.cacheBust) {
                        // eslint-disable-next-line no-param-reassign
                        resourceUrl += (/\?/.test(resourceUrl) ? '&' : '?') + new Date().getTime();
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchAsDataURL(resourceUrl, options.fetchRequestInit, function (_a) {
                            var res = _a.res, result = _a.result;
                            if (!contentType) {
                                // eslint-disable-next-line no-param-reassign
                                contentType = res.headers.get('Content-Type') || '';
                            }
                            return getContentFromDataUrl(result);
                        })];
                case 2:
                    content = _a.sent();
                    dataURL = makeDataUrl(content, contentType);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    dataURL = options.imagePlaceholder || '';
                    msg = "Failed to fetch resource: ".concat(resourceUrl);
                    if (error_1) {
                        msg = typeof error_1 === 'string' ? error_1 : error_1.message;
                    }
                    if (msg) {
                        console.warn(msg);
                    }
                    return [3 /*break*/, 4];
                case 4:
                    cache[cacheKey] = dataURL;
                    return [2 /*return*/, dataURL];
            }
        });
    });
}
exports.resourceToDataURL = resourceToDataURL;

},{}],11:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedImages = void 0;
var embed_resources_1 = require("./embed-resources");
var util_1 = require("./util");
var dataurl_1 = require("./dataurl");
var mimes_1 = require("./mimes");
function embedProp(propName, node, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var propValue, cssString;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
                    if (!propValue) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, embed_resources_1.embedResources)(propValue, null, options)];
                case 1:
                    cssString = _b.sent();
                    node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
                    return [2 /*return*/, true];
                case 2: return [2 /*return*/, false];
            }
        });
    });
}
function embedBackground(clonedNode, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, embedProp('background', clonedNode, options)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, embedProp('background-image', clonedNode, options)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, embedProp('mask', clonedNode, options)];
                case 4:
                    if (!!(_a.sent())) return [3 /*break*/, 6];
                    return [4 /*yield*/, embedProp('mask-image', clonedNode, options)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function embedImageNode(clonedNode, options) {
    return __awaiter(this, void 0, void 0, function () {
        var isImageElement, url, dataURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isImageElement = (0, util_1.isInstanceOfElement)(clonedNode, HTMLImageElement);
                    if (!(isImageElement && !(0, dataurl_1.isDataUrl)(clonedNode.src)) &&
                        !((0, util_1.isInstanceOfElement)(clonedNode, SVGImageElement) &&
                            !(0, dataurl_1.isDataUrl)(clonedNode.href.baseVal))) {
                        return [2 /*return*/];
                    }
                    url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
                    return [4 /*yield*/, (0, dataurl_1.resourceToDataURL)(url, (0, mimes_1.getMimeType)(url), options)];
                case 1:
                    dataURL = _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            clonedNode.onload = resolve;
                            clonedNode.onerror = reject;
                            var image = clonedNode;
                            if (image.decode) {
                                image.decode = resolve;
                            }
                            if (image.loading === 'lazy') {
                                image.loading = 'eager';
                            }
                            if (isImageElement) {
                                clonedNode.srcset = '';
                                clonedNode.src = dataURL;
                            }
                            else {
                                clonedNode.href.baseVal = dataURL;
                            }
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function embedChildren(clonedNode, options) {
    return __awaiter(this, void 0, void 0, function () {
        var children, deferreds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    children = (0, util_1.toArray)(clonedNode.childNodes);
                    deferreds = children.map(function (child) { return embedImages(child, options); });
                    return [4 /*yield*/, Promise.all(deferreds).then(function () { return clonedNode; })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function embedImages(clonedNode, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, util_1.isInstanceOfElement)(clonedNode, Element)) return [3 /*break*/, 4];
                    return [4 /*yield*/, embedBackground(clonedNode, options)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, embedImageNode(clonedNode, options)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, embedChildren(clonedNode, options)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.embedImages = embedImages;

},{"./dataurl":10,"./embed-resources":12,"./mimes":15,"./util":16}],12:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedResources = exports.shouldEmbed = exports.embed = exports.parseURLs = void 0;
var util_1 = require("./util");
var mimes_1 = require("./mimes");
var dataurl_1 = require("./dataurl");
var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function toRegex(url) {
    // eslint-disable-next-line no-useless-escape
    var escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp("(url\\(['\"]?)(".concat(escaped, ")(['\"]?\\))"), 'g');
}
function parseURLs(cssText) {
    var urls = [];
    cssText.replace(URL_REGEX, function (raw, quotation, url) {
        urls.push(url);
        return raw;
    });
    return urls.filter(function (url) { return !(0, dataurl_1.isDataUrl)(url); });
}
exports.parseURLs = parseURLs;
function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedURL, contentType, dataURL, content, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    resolvedURL = baseURL ? (0, util_1.resolveUrl)(resourceURL, baseURL) : resourceURL;
                    contentType = (0, mimes_1.getMimeType)(resourceURL);
                    dataURL = void 0;
                    if (!getContentFromUrl) return [3 /*break*/, 2];
                    return [4 /*yield*/, getContentFromUrl(resolvedURL)];
                case 1:
                    content = _a.sent();
                    dataURL = (0, dataurl_1.makeDataUrl)(content, contentType);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (0, dataurl_1.resourceToDataURL)(resolvedURL, contentType, options)];
                case 3:
                    dataURL = _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, cssText.replace(toRegex(resourceURL), "$1".concat(dataURL, "$3"))];
                case 5:
                    error_1 = _a.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, cssText];
            }
        });
    });
}
exports.embed = embed;
function filterPreferredFontFormat(str, _a) {
    var preferredFontFormat = _a.preferredFontFormat;
    return !preferredFontFormat
        ? str
        : str.replace(FONT_SRC_REGEX, function (match) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                var _a = URL_WITH_FORMAT_REGEX.exec(match) || [], src = _a[0], format = _a[2];
                if (!format) {
                    return '';
                }
                if (format === preferredFontFormat) {
                    return "src: ".concat(src, ";");
                }
            }
        });
}
function shouldEmbed(url) {
    return url.search(URL_REGEX) !== -1;
}
exports.shouldEmbed = shouldEmbed;
function embedResources(cssText, baseUrl, options) {
    return __awaiter(this, void 0, void 0, function () {
        var filteredCSSText, urls;
        return __generator(this, function (_a) {
            if (!shouldEmbed(cssText)) {
                return [2 /*return*/, cssText];
            }
            filteredCSSText = filterPreferredFontFormat(cssText, options);
            urls = parseURLs(filteredCSSText);
            return [2 /*return*/, urls.reduce(function (deferred, url) {
                    return deferred.then(function (css) { return embed(css, url, baseUrl, options); });
                }, Promise.resolve(filteredCSSText))];
        });
    });
}
exports.embedResources = embedResources;

},{"./dataurl":10,"./mimes":15,"./util":16}],13:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedWebFonts = exports.getWebFontCSS = void 0;
var util_1 = require("./util");
var dataurl_1 = require("./dataurl");
var embed_resources_1 = require("./embed-resources");
var cssFetchCache = {};
function fetchCSS(url) {
    return __awaiter(this, void 0, void 0, function () {
        var cache, res, cssText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cache = cssFetchCache[url];
                    if (cache != null) {
                        return [2 /*return*/, cache];
                    }
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.text()];
                case 2:
                    cssText = _a.sent();
                    cache = { url: url, cssText: cssText };
                    cssFetchCache[url] = cache;
                    return [2 /*return*/, cache];
            }
        });
    });
}
function embedFonts(data, options) {
    return __awaiter(this, void 0, void 0, function () {
        var cssText, regexUrl, fontLocs, loadFonts;
        var _this = this;
        return __generator(this, function (_a) {
            cssText = data.cssText;
            regexUrl = /url\(["']?([^"')]+)["']?\)/g;
            fontLocs = cssText.match(/url\([^)]+\)/g) || [];
            loadFonts = fontLocs.map(function (loc) { return __awaiter(_this, void 0, void 0, function () {
                var url;
                return __generator(this, function (_a) {
                    url = loc.replace(regexUrl, '$1');
                    if (!url.startsWith('https://')) {
                        url = new URL(url, data.url).href;
                    }
                    return [2 /*return*/, (0, dataurl_1.fetchAsDataURL)(url, options.fetchRequestInit, function (_a) {
                            var result = _a.result;
                            cssText = cssText.replace(loc, "url(".concat(result, ")"));
                            return [loc, result];
                        })];
                });
            }); });
            return [2 /*return*/, Promise.all(loadFonts).then(function () { return cssText; })];
        });
    });
}
function parseCSS(source) {
    if (source == null) {
        return [];
    }
    var result = [];
    var commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
    // strip out comments
    var cssText = source.replace(commentsRegex, '');
    // eslint-disable-next-line prefer-regex-literals
    var keyframesRegex = new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        var matches = keyframesRegex.exec(cssText);
        if (matches === null) {
            break;
        }
        result.push(matches[0]);
    }
    cssText = cssText.replace(keyframesRegex, '');
    var importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
    // to match css & media queries together
    var combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]' +
        '*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})';
    // unified regex
    var unifiedRegex = new RegExp(combinedCSSRegex, 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        var matches = importRegex.exec(cssText);
        if (matches === null) {
            matches = unifiedRegex.exec(cssText);
            if (matches === null) {
                break;
            }
            else {
                importRegex.lastIndex = unifiedRegex.lastIndex;
            }
        }
        else {
            unifiedRegex.lastIndex = importRegex.lastIndex;
        }
        result.push(matches[0]);
    }
    return result;
}
function getCSSRules(styleSheets, options) {
    return __awaiter(this, void 0, void 0, function () {
        var ret, deferreds;
        return __generator(this, function (_a) {
            ret = [];
            deferreds = [];
            // First loop inlines imports
            styleSheets.forEach(function (sheet) {
                if ('cssRules' in sheet) {
                    try {
                        (0, util_1.toArray)(sheet.cssRules || []).forEach(function (item, index) {
                            if (item.type === CSSRule.IMPORT_RULE) {
                                var importIndex_1 = index + 1;
                                var url = item.href;
                                var deferred = fetchCSS(url)
                                    .then(function (metadata) { return embedFonts(metadata, options); })
                                    .then(function (cssText) {
                                    return parseCSS(cssText).forEach(function (rule) {
                                        try {
                                            sheet.insertRule(rule, rule.startsWith('@import')
                                                ? (importIndex_1 += 1)
                                                : sheet.cssRules.length);
                                        }
                                        catch (error) {
                                            console.error('Error inserting rule from remote css', {
                                                rule: rule,
                                                error: error,
                                            });
                                        }
                                    });
                                })
                                    .catch(function (e) {
                                    console.error('Error loading remote css', e.toString());
                                });
                                deferreds.push(deferred);
                            }
                        });
                    }
                    catch (e) {
                        var inline_1 = styleSheets.find(function (a) { return a.href == null; }) || document.styleSheets[0];
                        if (sheet.href != null) {
                            deferreds.push(fetchCSS(sheet.href)
                                .then(function (metadata) { return embedFonts(metadata, options); })
                                .then(function (cssText) {
                                return parseCSS(cssText).forEach(function (rule) {
                                    inline_1.insertRule(rule, sheet.cssRules.length);
                                });
                            })
                                .catch(function (err) {
                                console.error('Error loading remote stylesheet', err);
                            }));
                        }
                        console.error('Error inlining remote css file', e);
                    }
                }
            });
            return [2 /*return*/, Promise.all(deferreds).then(function () {
                    // Second loop parses rules
                    styleSheets.forEach(function (sheet) {
                        if ('cssRules' in sheet) {
                            try {
                                (0, util_1.toArray)(sheet.cssRules || []).forEach(function (item) {
                                    ret.push(item);
                                });
                            }
                            catch (e) {
                                console.error("Error while reading CSS rules from ".concat(sheet.href), e);
                            }
                        }
                    });
                    return ret;
                })];
        });
    });
}
function getWebFontRules(cssRules) {
    return cssRules
        .filter(function (rule) { return rule.type === CSSRule.FONT_FACE_RULE; })
        .filter(function (rule) { return (0, embed_resources_1.shouldEmbed)(rule.style.getPropertyValue('src')); });
}
function parseWebFontRules(node, options) {
    return __awaiter(this, void 0, void 0, function () {
        var styleSheets, cssRules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (node.ownerDocument == null) {
                        throw new Error('Provided element is not within a Document');
                    }
                    styleSheets = (0, util_1.toArray)(node.ownerDocument.styleSheets);
                    return [4 /*yield*/, getCSSRules(styleSheets, options)];
                case 1:
                    cssRules = _a.sent();
                    return [2 /*return*/, getWebFontRules(cssRules)];
            }
        });
    });
}
function getWebFontCSS(node, options) {
    return __awaiter(this, void 0, void 0, function () {
        var rules, cssTexts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parseWebFontRules(node, options)];
                case 1:
                    rules = _a.sent();
                    return [4 /*yield*/, Promise.all(rules.map(function (rule) {
                            var baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
                            return (0, embed_resources_1.embedResources)(rule.cssText, baseUrl, options);
                        }))];
                case 2:
                    cssTexts = _a.sent();
                    return [2 /*return*/, cssTexts.join('\n')];
            }
        });
    });
}
exports.getWebFontCSS = getWebFontCSS;
function embedWebFonts(clonedNode, options) {
    return __awaiter(this, void 0, void 0, function () {
        var cssText, _a, _b, styleNode, sytleContent;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(options.fontEmbedCSS != null)) return [3 /*break*/, 1];
                    _a = options.fontEmbedCSS;
                    return [3 /*break*/, 5];
                case 1:
                    if (!options.skipFonts) return [3 /*break*/, 2];
                    _b = null;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getWebFontCSS(clonedNode, options)];
                case 3:
                    _b = _c.sent();
                    _c.label = 4;
                case 4:
                    _a = _b;
                    _c.label = 5;
                case 5:
                    cssText = _a;
                    if (cssText) {
                        styleNode = document.createElement('style');
                        sytleContent = document.createTextNode(cssText);
                        styleNode.appendChild(sytleContent);
                        if (clonedNode.firstChild) {
                            clonedNode.insertBefore(styleNode, clonedNode.firstChild);
                        }
                        else {
                            clonedNode.appendChild(styleNode);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.embedWebFonts = embedWebFonts;

},{"./dataurl":10,"./embed-resources":12,"./util":16}],14:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontEmbedCSS = exports.toBlob = exports.toJpeg = exports.toPng = exports.toPixelData = exports.toCanvas = exports.toSvg = void 0;
var clone_node_1 = require("./clone-node");
var embed_images_1 = require("./embed-images");
var apply_style_1 = require("./apply-style");
var embed_webfonts_1 = require("./embed-webfonts");
var util_1 = require("./util");
function toSvg(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, width, height, clonedNode, datauri;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
                    return [4 /*yield*/, (0, clone_node_1.cloneNode)(node, options, true)];
                case 1:
                    clonedNode = (_b.sent());
                    return [4 /*yield*/, (0, embed_webfonts_1.embedWebFonts)(clonedNode, options)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, embed_images_1.embedImages)(clonedNode, options)];
                case 3:
                    _b.sent();
                    (0, apply_style_1.applyStyle)(clonedNode, options);
                    return [4 /*yield*/, (0, util_1.nodeToDataURL)(clonedNode, width, height)];
                case 4:
                    datauri = _b.sent();
                    return [2 /*return*/, datauri];
            }
        });
    });
}
exports.toSvg = toSvg;
function toCanvas(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, width, height, svg, img, canvas, context, ratio, canvasWidth, canvasHeight;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
                    return [4 /*yield*/, toSvg(node, options)];
                case 1:
                    svg = _b.sent();
                    return [4 /*yield*/, (0, util_1.createImage)(svg)];
                case 2:
                    img = _b.sent();
                    canvas = document.createElement('canvas');
                    context = canvas.getContext('2d');
                    ratio = options.pixelRatio || (0, util_1.getPixelRatio)();
                    canvasWidth = options.canvasWidth || width;
                    canvasHeight = options.canvasHeight || height;
                    canvas.width = canvasWidth * ratio;
                    canvas.height = canvasHeight * ratio;
                    if (!options.skipAutoScale) {
                        (0, util_1.checkCanvasDimensions)(canvas);
                    }
                    canvas.style.width = "".concat(canvasWidth);
                    canvas.style.height = "".concat(canvasHeight);
                    if (options.backgroundColor) {
                        context.fillStyle = options.backgroundColor;
                        context.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    return [2 /*return*/, canvas];
            }
        });
    });
}
exports.toCanvas = toCanvas;
function toPixelData(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, width, height, canvas, ctx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
                    return [4 /*yield*/, toCanvas(node, options)];
                case 1:
                    canvas = _b.sent();
                    ctx = canvas.getContext('2d');
                    return [2 /*return*/, ctx.getImageData(0, 0, width, height).data];
            }
        });
    });
}
exports.toPixelData = toPixelData;
function toPng(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var canvas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, toCanvas(node, options)];
                case 1:
                    canvas = _a.sent();
                    return [2 /*return*/, canvas.toDataURL()];
            }
        });
    });
}
exports.toPng = toPng;
function toJpeg(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var canvas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, toCanvas(node, options)];
                case 1:
                    canvas = _a.sent();
                    return [2 /*return*/, canvas.toDataURL('image/jpeg', options.quality || 1)];
            }
        });
    });
}
exports.toJpeg = toJpeg;
function toBlob(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var canvas, blob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, toCanvas(node, options)];
                case 1:
                    canvas = _a.sent();
                    return [4 /*yield*/, (0, util_1.canvasToBlob)(canvas)];
                case 2:
                    blob = _a.sent();
                    return [2 /*return*/, blob];
            }
        });
    });
}
exports.toBlob = toBlob;
function getFontEmbedCSS(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, embed_webfonts_1.getWebFontCSS)(node, options)];
        });
    });
}
exports.getFontEmbedCSS = getFontEmbedCSS;

},{"./apply-style":7,"./clone-node":8,"./embed-images":11,"./embed-webfonts":13,"./util":16}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMimeType = void 0;
var WOFF = 'application/font-woff';
var JPEG = 'image/jpeg';
var mimes = {
    woff: WOFF,
    woff2: WOFF,
    ttf: 'application/font-truetype',
    eot: 'application/vnd.ms-fontobject',
    png: 'image/png',
    jpg: JPEG,
    jpeg: JPEG,
    gif: 'image/gif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
    webp: 'image/webp',
};
function getExtension(url) {
    var match = /\.([^./]*?)$/g.exec(url);
    return match ? match[1] : '';
}
function getMimeType(url) {
    var extension = getExtension(url).toLowerCase();
    return mimes[extension] || '';
}
exports.getMimeType = getMimeType;

},{}],16:[function(require,module,exports){
(function (process){(function (){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInstanceOfElement = exports.nodeToDataURL = exports.svgToDataURL = exports.createImage = exports.canvasToBlob = exports.checkCanvasDimensions = exports.getPixelRatio = exports.getImageSize = exports.toArray = exports.delay = exports.uuid = exports.resolveUrl = void 0;
function resolveUrl(url, baseUrl) {
    // url is absolute already
    if (url.match(/^[a-z]+:\/\//i)) {
        return url;
    }
    // url is absolute already, without protocol
    if (url.match(/^\/\//)) {
        return window.location.protocol + url;
    }
    // dataURI, mailto:, tel:, etc.
    if (url.match(/^[a-z]+:/i)) {
        return url;
    }
    var doc = document.implementation.createHTMLDocument();
    var base = doc.createElement('base');
    var a = doc.createElement('a');
    doc.head.appendChild(base);
    doc.body.appendChild(a);
    if (baseUrl) {
        base.href = baseUrl;
    }
    a.href = url;
    return a.href;
}
exports.resolveUrl = resolveUrl;
exports.uuid = (function () {
    // generate uuid for className of pseudo elements.
    // We should not use GUIDs, otherwise pseudo elements sometimes cannot be captured.
    var counter = 0;
    // ref: http://stackoverflow.com/a/6248722/2519373
    var random = function () {
        // eslint-disable-next-line no-bitwise
        return "0000".concat(((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
    };
    return function () {
        counter += 1;
        return "u".concat(random()).concat(counter);
    };
})();
function delay(ms) {
    return function (args) {
        return new Promise(function (resolve) {
            setTimeout(function () { return resolve(args); }, ms);
        });
    };
}
exports.delay = delay;
function toArray(arrayLike) {
    var arr = [];
    for (var i = 0, l = arrayLike.length; i < l; i++) {
        arr.push(arrayLike[i]);
    }
    return arr;
}
exports.toArray = toArray;
function px(node, styleProperty) {
    var win = node.ownerDocument.defaultView || window;
    var val = win.getComputedStyle(node).getPropertyValue(styleProperty);
    return val ? parseFloat(val.replace('px', '')) : 0;
}
function getNodeWidth(node) {
    var leftBorder = px(node, 'border-left-width');
    var rightBorder = px(node, 'border-right-width');
    return node.clientWidth + leftBorder + rightBorder;
}
function getNodeHeight(node) {
    var topBorder = px(node, 'border-top-width');
    var bottomBorder = px(node, 'border-bottom-width');
    return node.clientHeight + topBorder + bottomBorder;
}
function getImageSize(targetNode, options) {
    if (options === void 0) { options = {}; }
    var width = options.width || getNodeWidth(targetNode);
    var height = options.height || getNodeHeight(targetNode);
    return { width: width, height: height };
}
exports.getImageSize = getImageSize;
function getPixelRatio() {
    var ratio;
    var FINAL_PROCESS;
    try {
        FINAL_PROCESS = process;
    }
    catch (e) {
        // pass
    }
    var val = FINAL_PROCESS && FINAL_PROCESS.env
        ? FINAL_PROCESS.env.devicePixelRatio
        : null;
    if (val) {
        ratio = parseInt(val, 10);
        if (Number.isNaN(ratio)) {
            ratio = 1;
        }
    }
    return ratio || window.devicePixelRatio || 1;
}
exports.getPixelRatio = getPixelRatio;
// @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
var canvasDimensionLimit = 16384;
function checkCanvasDimensions(canvas) {
    if (canvas.width > canvasDimensionLimit ||
        canvas.height > canvasDimensionLimit) {
        if (canvas.width > canvasDimensionLimit &&
            canvas.height > canvasDimensionLimit) {
            if (canvas.width > canvas.height) {
                canvas.height *= canvasDimensionLimit / canvas.width;
                canvas.width = canvasDimensionLimit;
            }
            else {
                canvas.width *= canvasDimensionLimit / canvas.height;
                canvas.height = canvasDimensionLimit;
            }
        }
        else if (canvas.width > canvasDimensionLimit) {
            canvas.height *= canvasDimensionLimit / canvas.width;
            canvas.width = canvasDimensionLimit;
        }
        else {
            canvas.width *= canvasDimensionLimit / canvas.height;
            canvas.height = canvasDimensionLimit;
        }
    }
}
exports.checkCanvasDimensions = checkCanvasDimensions;
function canvasToBlob(canvas, options) {
    if (options === void 0) { options = {}; }
    if (canvas.toBlob) {
        return new Promise(function (resolve) {
            canvas.toBlob(resolve, options.type ? options.type : 'image/png', options.quality ? options.quality : 1);
        });
    }
    return new Promise(function (resolve) {
        var binaryString = window.atob(canvas
            .toDataURL(options.type ? options.type : undefined, options.quality ? options.quality : undefined)
            .split(',')[1]);
        var len = binaryString.length;
        var binaryArray = new Uint8Array(len);
        for (var i = 0; i < len; i += 1) {
            binaryArray[i] = binaryString.charCodeAt(i);
        }
        resolve(new Blob([binaryArray], {
            type: options.type ? options.type : 'image/png',
        }));
    });
}
exports.canvasToBlob = canvasToBlob;
function createImage(url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.decode = function () { return resolve(img); };
        img.onload = function () { return resolve(img); };
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.src = url;
    });
}
exports.createImage = createImage;
function svgToDataURL(svg) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve()
                    .then(function () { return new XMLSerializer().serializeToString(svg); })
                    .then(encodeURIComponent)
                    .then(function (html) { return "data:image/svg+xml;charset=utf-8,".concat(html); })];
        });
    });
}
exports.svgToDataURL = svgToDataURL;
function nodeToDataURL(node, width, height) {
    return __awaiter(this, void 0, void 0, function () {
        var xmlns, svg, foreignObject;
        return __generator(this, function (_a) {
            xmlns = 'http://www.w3.org/2000/svg';
            svg = document.createElementNS(xmlns, 'svg');
            foreignObject = document.createElementNS(xmlns, 'foreignObject');
            svg.setAttribute('width', "".concat(width));
            svg.setAttribute('height', "".concat(height));
            svg.setAttribute('viewBox', "0 0 ".concat(width, " ").concat(height));
            foreignObject.setAttribute('width', '100%');
            foreignObject.setAttribute('height', '100%');
            foreignObject.setAttribute('x', '0');
            foreignObject.setAttribute('y', '0');
            foreignObject.setAttribute('externalResourcesRequired', 'true');
            svg.appendChild(foreignObject);
            foreignObject.appendChild(node);
            return [2 /*return*/, svgToDataURL(svg)];
        });
    });
}
exports.nodeToDataURL = nodeToDataURL;
var isInstanceOfElement = function (node, instance) {
    if (node instanceof instance)
        return true;
    var nodePrototype = Object.getPrototypeOf(node);
    if (nodePrototype === null)
        return false;
    return (nodePrototype.constructor.name === instance.name ||
        (0, exports.isInstanceOfElement)(nodePrototype, instance));
};
exports.isInstanceOfElement = isInstanceOfElement;

}).call(this)}).call(this,require('_process'))
},{"_process":1}]},{},[2]);
