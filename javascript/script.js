import { Card } from "./card.js";

const addCardBtn = document.querySelector("#add-card-btn");
const toDoFeed = document.querySelector("#to-do-card-container");
const doingFeed = document.querySelector("#doing-card-container");
const doneFeed = document.querySelector("#done-card-container");

let todoCards = [];
let doingCards = [];
let doneCards = [];

getData();

render();


document.getElementById("removeLocalStorage")
.addEventListener("click", function(){
    localStorage.clear();
})


let date = new Date()
console.log((new Date()).toLocaleString())


//TO DO FEED EVENT LISTENERS

toDoFeed.addEventListener("keypress", saveTextInput);
toDoFeed.addEventListener("focusout", saveTextInput);
toDoFeed.addEventListener("click", changeTextWrapper);
toDoFeed.addEventListener("click", deleteCard);
toDoFeed.addEventListener("click", pushForward);
addCardBtn.addEventListener("click", addNewCard);


//DOING FEED EVENT LISTENERS

doingFeed.addEventListener("keypress", saveTextInput);
doingFeed.addEventListener("focusout", saveTextInput);
doingFeed.addEventListener("click", changeTextWrapper);
doingFeed.addEventListener("click", deleteCard);
doingFeed.addEventListener("click", pushForward);


//DONE FEED EVENT LISTENERS

doneFeed.addEventListener("keypress", saveTextInput);
doneFeed.addEventListener("focusout", saveTextInput);
doneFeed.addEventListener("click", changeTextWrapper);
doneFeed.addEventListener("click", deleteCard);


//Limits maximum textarea to 1

let notInEditing = true;

function saveTextInput(e) {
    const triggeredArray = returnFeed(e.currentTarget.dataset.feed);
    const modularId = /(todo|doing|done)\d+/;
    if(modularId.test(e.target.id)){
        e.srcElement.style.height = `auto`;
        e.srcElement.style.height = `${e.srcElement.scrollHeight}px`;
        if(e.key == "Enter" || e.type == "focusout"){
            if(e.target.value == ""){
                triggeredArray.splice(e.target.dataset.indexNumber, 1);
                addCardBtn.disabled = false;
                notInEditing = true;
            } else {
                const indexNr = e.target.dataset.indexNumber;
                triggeredArray[indexNr].toDoText = e.target.value;
                triggeredArray[indexNr].textWrapper = 'p';
                addCardBtn.disabled = false;
                notInEditing = true;
            }
            render();
        }
    }
}

function returnFeed(feedData) {
    if(feedData == "todo") {
        return todoCards;
    } else if (feedData == "doing") {
        return doingCards;
    } else if (feedData == "done") {
        return doneCards;
    }
}

function returnTargetFeed(feedData) {
    if(feedData == "todo") {
        return doingCards;
    } else if (feedData == "doing") {
        return doneCards;
    }
}

function returnNewParentFeed(feedData) {
    if(feedData == "todo") {
        return "doing";
    } else if(feedData == "doing") {
        return "done";
    }
}

function deleteCard(e) {
    const triggeredArray = returnFeed(e.currentTarget.dataset.feed);
    if(e.target.dataset.type == "close-card-btn") {
        triggeredArray.splice(e.target.dataset.indexNumber, 1);
        render();
    }
}

function pushForward(e) {
    const triggeredArray = returnFeed(e.currentTarget.dataset.feed);
    const targetArray = returnTargetFeed(e.currentTarget.dataset.feed);
    const newParentFeed = returnNewParentFeed(e.currentTarget.dataset.feed);
    if(e.target.dataset.type == "push-card-btn") {
        triggeredArray[e.target.dataset.indexNumber].parentFeed = newParentFeed;
        targetArray.unshift(triggeredArray[e.target.dataset.indexNumber])
        triggeredArray.splice(e.target.dataset.indexNumber, 1);
        render();
    }
}

function changeTextWrapper(e) {
    const triggerFeed = e.currentTarget.dataset.feed;
    const triggeredArray = returnFeed(triggerFeed);
    const indexNr = e.target.dataset.indexNumber;
    console.log(`${triggerFeed}${indexNr}`)
    if(triggeredArray[indexNr].textWrapper == 'p' && notInEditing && e.target.dataset.type == "textarea") {
        notInEditing = false;
        addCardBtn.disabled = true;
        triggeredArray[indexNr].textWrapper = 'textarea';
        render();
        const textAreaEdit = document.getElementById(`${triggerFeed}${indexNr}`)
        textAreaEdit.style.height = `auto`;
        textAreaEdit.style.height = `${textAreaEdit.scrollHeight}px`;
        document.getElementById(`${triggerFeed}${indexNr}`).focus();
        
    }  
}

 function addNewCard() {
    todoCards.unshift(new Card());
    updateCardIndex(todoCards)
    addCardBtn.disabled = true;
    render();
    document.getElementById("todo0").focus();
}

function updateCardIndex(list) {
    list.forEach(card => card.listIndex = list.indexOf(card));
}

 function generateHtml (card) {
    card.cardHtml = `
    <div class="card">
        <${card.textWrapper} 
        data-index-number="${card.listIndex}"
        data-type="textarea"
            class="card-div textfield draggable" 
            id="${card.parentFeed}${card.listIndex}" 
            data-index-number="${card.listIndex}" 
            style="height:auto">${card.toDoText}</${card.textWrapper}>
        <div class="card-footer">
            <div class="date-created">${card.dateStarted}</div>
                <button 
                    class="push-card-btn" 
                    data-index-number="${card.listIndex}"
                    data-type="push-card-btn"
                >
                    &#8594;
                </button>
        </div>  
        <button 
            class="close-card-btn"
            data-index-number="${card.listIndex}"
            data-type="close-card-btn"
        >
            &#10006;
        </button>
    </div>`
 }

function render() {
    updateCardIndex(todoCards);
    updateCardIndex(doingCards);
    updateCardIndex(doneCards);
    toDoFeed.innerHTML = '';
    doingFeed.innerHTML = '';
    doneFeed.innerHTML = '';
    todoCards.forEach(element =>{
        generateHtml(element);
        toDoFeed.innerHTML += element.cardHtml;
    });
    doingCards.forEach(element =>{
        generateHtml(element);
        doingFeed.innerHTML += element.cardHtml;
    });
    doneCards.forEach(element =>{
        generateHtml(element);
        doneFeed.innerHTML += element.cardHtml;
    });
    saveData();
}


function saveData() {
    window.localStorage.setItem('todoFeed', JSON.stringify(todoCards));
    window.localStorage.setItem('doingFeed', JSON.stringify(doingCards));
    window.localStorage.setItem('doneFeed', JSON.stringify(doneCards));
}

function getData() {
    todoCards = JSON.parse(window.localStorage.getItem('todoFeed')) ? JSON.parse(window.localStorage.getItem('todoFeed')) : [];
    doingCards = JSON.parse(window.localStorage.getItem('doingFeed')) ? JSON.parse(window.localStorage.getItem('doingFeed')) : [];
    doneCards = JSON.parse(window.localStorage.getItem('doneFeed')) ? JSON.parse(window.localStorage.getItem('doneFeed')) : [];
}



