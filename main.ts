import { Invocation, Item, Warrior, cardFactory } from "./modules/card.js";
import { Effect } from "./modules/effect.js";
import { keywordFactory } from "./modules/keyword.js";
import { Strength } from "./modules/strength.js";

import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

let HTMLVisualisation = document.getElementById('visualisation');

let card : Warrior|Item|Invocation = new Warrior('', Strength.WEAK, '');

HTMLVisualisation.append(card.getHTML());

let HTMLDownloadImage = document.getElementById('actions').getElementsByTagName('a')[0];

// Type and strength management
let HTMLTypeField = document.getElementById('type');
let HTMLStrengthField = document.getElementById('strength');
let HTMLType = HTMLTypeField.getElementsByTagName('select')[0];
HTMLType.addEventListener('change', () => {
    if(HTMLType.value == 'warrior' || HTMLType.value == 'item') {
        HTMLStrengthField.style.display = '';
    } else {
        HTMLStrengthField.style.display = 'none';
    }
})

// Keywords management
let HTMLKeywordField = document.getElementById('keywords');
let HTMLKeywordSelect = HTMLKeywordField.getElementsByTagName('select')[0];
let HTMLKeywords = HTMLKeywordField.getElementsByTagName('div')[0];
HTMLKeywordSelect.addEventListener('change', () => {
    // Check if the keyword is already in the selected list
    let HTMLKeyword : HTMLButtonElement|null = null;
    Array.from(HTMLKeywords.getElementsByTagName('button')).forEach(button => {
        if(button.getAttribute('data-value').split('_')[0] == HTMLKeywordSelect.value) {
            HTMLKeyword = button;
        }
    });
    if(HTMLKeyword) {
        // If it's in the list, append '_X' to it with 'X' being the number or times it's been selected
        if(HTMLKeyword.getAttribute('data-value').split('_').length == 1) {
            HTMLKeyword.setAttribute('data-value', HTMLKeyword.getAttribute('data-value') + '_2');
            HTMLKeyword.textContent += ' 2';
        } else {
            HTMLKeyword.setAttribute('data-value', HTMLKeyword.getAttribute('data-value').split('_')[0] + '_' + (parseInt(HTMLKeyword.getAttribute('data-value').split('_')[1]) + 1))
            HTMLKeyword.textContent = HTMLKeyword.textContent.split(' ')[0] + ' ' + parseInt(HTMLKeyword.getAttribute('data-value').split('_')[1]);
        }
    } else {
        // Otherwise, create it and add it to the list
        HTMLKeyword = document.createElement('button');
        HTMLKeyword.setAttribute('data-value', HTMLKeywordSelect.value);
        HTMLKeyword.textContent = HTMLKeywordSelect.options[HTMLKeywordSelect.selectedIndex].text;
        HTMLKeyword.classList.add('keyword')
        HTMLKeyword.addEventListener('click', () => {
            // Handles deletion
            if(HTMLKeyword.getAttribute('data-value').split('_').length == 1) {
                HTMLKeyword.outerHTML = '';
            } else if(HTMLKeyword.getAttribute('data-value').split('_')[1] == '2') {
                HTMLKeyword.setAttribute('data-value', HTMLKeyword.getAttribute('data-value').split('_')[0]);
                HTMLKeyword.textContent = HTMLKeyword.textContent.split(' ')[0];
            } else {
                HTMLKeyword.setAttribute('data-value', HTMLKeyword.getAttribute('data-value').split('_')[0] + '_' + (parseInt(HTMLKeyword.getAttribute('data-value').split('_')[1]) - 1))
                HTMLKeyword.textContent = HTMLKeyword.textContent.split(' ')[0] + ' ' + parseInt(HTMLKeyword.getAttribute('data-value').split('_')[1]);
            }
            updateCard();
        })
        HTMLKeywords.append(HTMLKeyword);
    }
    

    HTMLKeywordSelect.value = 'default';
})

// Effect management
let HTMLEffectField = document.getElementById('effect');
let HTMLCost = HTMLEffectField.children[1].getElementsByTagName('input')[0];
let HTMLPlus = document.getElementById('plus');
HTMLPlus.addEventListener('click', () => {
    HTMLCost.value = (parseInt(HTMLCost.value) + 1).toString();
    updateCard();
})
let HTMLMinus = document.getElementById('minus');
HTMLMinus.addEventListener('click', () => {
    if(HTMLCost.value != '0') {
        HTMLCost.value = (parseInt(HTMLCost.value) - 1).toString();
    }
    updateCard();
})

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
]

function updateCard(){
    HTMLVisualisation.children[1].outerHTML = '';

    card = cardFactory(HTMLForm[0].value, HTMLForm[2].value, HTMLForm[1].value, HTMLForm[3].value);
    Array.from(HTMLKeywords.getElementsByTagName('button')).forEach(HTMLKeyword => {
        card.addKeyword(keywordFactory(HTMLKeyword.getAttribute('data-value')));
    });
    if (HTMLForm[5].value != ''){
        card.setEffect(new Effect(HTMLForm[5].value,  parseInt((HTMLForm[6] as HTMLInputElement).value) * -1));
    }
    if((HTMLForm[7] as HTMLInputElement).checked) {
        card.switchGimmicky();
    }
    if ((HTMLForm[8] as HTMLInputElement).checked) {
        card.switchConsistent();
    }
    
    HTMLVisualisation.append(card.getHTML());
    let HTMLCard = document.getElementById('card');

    let HTMLImage = HTMLVisualisation.getElementsByTagName('img')[0];
    if ((HTMLForm[3] as HTMLInputElement).files.length == 0) {
        HTMLImage.src = './assets/placeholder.png';
        let HTMLCard = document.getElementById('card');
        toPng(HTMLCard).then(function(dataURL) {
            HTMLDownloadImage.href = dataURL;
        }).catch(function(error) {
            console.error(error);
        })
    } else {
        let reader = new FileReader()
        reader.onload = (e) => {
            HTMLImage.src = (e.target.result as string);
            
            toPng(HTMLCard).then(function(dataURL) {
                HTMLDownloadImage.href = dataURL;
            }).catch(function(error) {
                console.error(error);
            })
        };
        reader.readAsDataURL((HTMLForm[3] as HTMLInputElement).files[0]);
    }

    console.log(card);
    document.getElementById('ep').textContent = card.getEp().toString();
}

HTMLForm.forEach(HTMLField => {
    HTMLField.addEventListener('change', updateCard);
});
