import { Card } from "./card.js";

const addCardBtn = document.querySelector("#add-card-btn");
const toDoFeed = document.querySelector("#to-do-card-container");
const doingFeed = document.querySelector("#doing-card-container");
const doneFeed = document.querySelector("#done-card-container");

let todoCards = [];
let doingCards = [];
let doneCards = [];
console.log(todoCards, doingCards, doneCards)
getData();
console.log(todoCards, doingCards, doneCards)
document.addEventListener('onload', render)
// localStorage.clear();

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
    const modularId = /card-div\d+/;
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
    return feedData == "todo" ? todoCards : feedData == "doing" ? doingCards : doneCards;
}

function returnTargetFeed(feedData) {
    return feedData == "todo" ? doingCards : feedData == "doing" ? doneCards : todoCards; 
}

function deleteCard(e) {
    const triggeredArray = returnFeed(e.currentTarget.dataset.feed);
    if(e.target.dataset.type == "close-card-btn") {
        triggeredArray.splice(e.target.dataset.indexNumber, 1);
        render();
    }
}

function pushForward(e) {
    // let triggeredArray
    // let targetArray
    // if(e.currentTarget.dataset.feed == "todo") {
    //     triggeredArray = todoCards;
    //     targetArray = doingCards;
    // }
    // if(e.currentTarget.dataset.feed == "doing") {
    //     triggeredArray = doingCards;
    //     targetArray = doneCards;
    // }
    // if(e.currentTarget.dataset.feed == "done") {
    //     triggeredArray = doneCards;
    //     targetArray = todoCards;
    // }
    const triggeredArray = returnFeed(e.currentTarget.dataset.feed);
    const targetArray = returnTargetFeed(e.currentTarget.dataset.feed);
    console.log(e.currentTarget.dataset.feed)
    console.log(todoCards, doingCards, doneCards)
    console.log(triggeredArray, targetArray)
    if(e.target.dataset.type == "push-card-btn") {
        targetArray.unshift(triggeredArray[e.target.dataset.indexNumber])
        triggeredArray.splice(e.target.dataset.indexNumber, 1);
    }
    render();
}

function changeTextWrapper(e) {
    const triggeredArray = returnFeed(e.currentTarget.dataset.feed);
    const indexNr = e.target.dataset.indexNumber;
    if(triggeredArray[indexNr].textWrapper == 'p' && notInEditing && e.target.dataset.type == "textarea") {
        notInEditing = false;
        addCardBtn.disabled = true;
        triggeredArray[indexNr].textWrapper = 'textarea';
        render();
        const textAreaEdit = document.getElementById(`card-div${indexNr}`)
        textAreaEdit.style.height = `auto`;
        textAreaEdit.style.height = `${textAreaEdit.scrollHeight}px`;
        document.getElementById(`card-div${indexNr}`).focus();
    }  
}

 function addNewCard() {
    todoCards.unshift(new Card());
    updateCardIndex(todoCards)
    addCardBtn.disabled = true;
    render();
    document.getElementById("card-div0").focus();
}

function updateCardIndex(list) {
    list.forEach(card => card.listIndex = list.indexOf(card));
}

function render() {
    updateCardIndex(todoCards);
    updateCardIndex(doingCards);
    updateCardIndex(doneCards);
    toDoFeed.innerHTML = '';
    doingFeed.innerHTML = '';
    doneFeed.innerHTML = '';
    todoCards.forEach(element =>{
        element.generateHtml();
        toDoFeed.innerHTML += element.cardHtml;
    });
    doingCards.forEach(element =>{
        element.generateHtml();
        doingFeed.innerHTML += element.cardHtml;
    });
    doneCards.forEach(element =>{
        element.generateHtml();
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
    // todoCards.forEach(element => element = new Card(element));
    // doingCards.forEach(element => element = new Card(element));
    // doneCards.forEach(element => element = new Card(element));
}



