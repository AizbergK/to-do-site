import { Card } from "./card.js";


// MAIN HTML OBJECTS

const addCardBtn = document.querySelector("#add-card-btn");
const toDoFeed = document.querySelector("#to-do-card-container");
const doingFeed = document.querySelector("#doing-card-container");
const doneFeed = document.querySelector("#done-card-container");


// INITIALIZING FROM LOCAL STORAGE

let todoCards = [];
let doingCards = [];
let doneCards = [];

getData();

render();


// REMOVE LOCAL STORAGE BUTTON

document.getElementById("removeLocalStorage")
.addEventListener("click", function(){
    localStorage.clear();
    getData();
    render();
})


let date = new Date();
console.log((new Date()).toLocaleString());


// TO DO FEED EVENT LISTENERS

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
doneFeed.addEventListener("click", pushForward);


//DRAG AND DROP FUNCTIONALITY

const draggableCards = document.querySelectorAll(".draggableContainer");

let draggedCardIndex;
let draggedFeedOrigin;
let draggedFeedTarget;
let targetFeedIndex;

draggableCards.forEach(draggable => {

    draggable.addEventListener("dragstart", function(e) { 
        e.target.classList.add("dragging");
    })

    draggable.addEventListener("dragend", function(e) {
        e.target.classList.remove("dragging");
        if(draggedFeedOrigin != draggedFeedTarget){
            moveCard(draggedCardIndex, draggedFeedTarget, draggedFeedOrigin, targetFeedIndex);
        } else {
            if(draggedCardIndex < targetFeedIndex){
                moveCard(draggedCardIndex, draggedFeedTarget, draggedFeedOrigin, targetFeedIndex);
            } else if(draggedCardIndex > targetFeedIndex) {
                moveCard(draggedCardIndex, draggedFeedTarget, draggedFeedOrigin, targetFeedIndex);
            }
        }
    })

    draggable.addEventListener("dragover", function(e) {
        e.preventDefault();
        const dragged = document.querySelector(".dragging");
        draggedCardIndex = dragged.dataset.indexNumber;
        draggedFeedOrigin = dragged.dataset.cardFeed;
        draggedFeedTarget = e.currentTarget.dataset.feed;
        try {
        targetFeedIndex = getTargetFeedIndex(e.clientY, returnFeed(draggedFeedTarget));
        } catch (error) {
            targetFeedIndex = 0;
        }
    })
})

function getTargetFeedIndex(mouseY, feed) {
    return feed.findLast(card => (mouseY - card.positionY) > 0).listIndex + 1;
}

// Limits maximum textareas in editing to 1

let notInEditing = true;


// Dynamically resize textarea according to current text height. Saves
// current text on losing focus or Enter and removes the card if it is empty and 
// save input is received. Toggles text wrapper from <textarea> to <p>

function saveTextInput(e) {
    const triggeredArray = returnFeed(e.currentTarget.dataset.feed);
    const modularId = /(texttodo|textdoing|textdone)\d+/;
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


// Returns the HTML element based on card metadata input.

function returnFeed(feedData) {
    if(feedData == "todo") {
        return todoCards;
    } else if (feedData == "doing") {
        return doingCards;
    } else if (feedData == "done") {
        return doneCards;
    }
}


// Returns the target feed based on current feed and push direction.

function returnNewParentFeed(feedData, direction = 1) {
    const feedsArray = ["todo", "doing", "done"];
    if(feedsArray.findIndex(feed => feed == feedData) + direction == -1) {
        return feedsArray[2];
    } else if(feedsArray.findIndex(feed => feed == feedData) + direction == 3) {
        return feedsArray[0];
    } else {
        return feedsArray[feedsArray.findIndex(feed => feed == feedData) + direction];
    }
    
}


// Removes card from the proper array.

function deleteCard(e) {
    const triggeredArray = returnFeed(e.currentTarget.dataset.feed);
    if(e.target.dataset.type == "close-card-btn") {
        triggeredArray.splice(e.target.dataset.indexNumber, 1);
        render();
    }
}


// Pushes card on button press based on button type dataset.

function pushForward(e) {
    if(e.target.dataset.type == "push-card-btn") {
        const index = e.target.dataset.indexNumber;
        const triggeredArray = e.currentTarget.dataset.feed;
        const targetArray = returnNewParentFeed(e.currentTarget.dataset.feed);
        moveCard(index, targetArray, triggeredArray);
    } else if(e.target.dataset.type == "reverse-card-btn") {
        const index = e.target.dataset.indexNumber;
        const triggeredArray = e.currentTarget.dataset.feed;
        const targetArray = returnNewParentFeed(e.currentTarget.dataset.feed, -1);
        moveCard(index, targetArray, triggeredArray);
    }
}


// Input: card index, card current array, target array and target index.
//
// Saves the card to be moved in a new const swapCard.
// Deletes the card from the origin array then moves it into the new array.
// Works on the same array.

function moveCard(cardIndex, passedTargetArray, passedTriggeredArray, targetFeedIndex = 0) {
    if(passedTargetArray == passedTriggeredArray && cardIndex < targetFeedIndex) {
        targetFeedIndex -= 1;
    }
    const triggeredArray = returnFeed(passedTriggeredArray);
    const targetArray = returnFeed(passedTargetArray);
    triggeredArray[cardIndex].parentFeed = passedTargetArray;
    const swapCard = triggeredArray[cardIndex]
    triggeredArray.splice(cardIndex, 1);
    targetArray.splice(targetFeedIndex, 0, swapCard);
    render();

}


// Checks the HTML object dataset for the unique ID attributed to textarea and
// changes toggles the text wrapper from <textarea> to <p> and automatically
// adjusts textarea height based on text height on keypress.

function changeTextWrapper(e) {
    const triggerFeed = e.currentTarget.dataset.feed;
    const triggeredArray = returnFeed(triggerFeed);
    const indexNr = e.target.dataset.indexNumber;
    if(triggeredArray[indexNr].textWrapper == 'p' && notInEditing && e.target.dataset.type == "textarea") {
        notInEditing = false;
        addCardBtn.disabled = true;
        triggeredArray[indexNr].textWrapper = 'textarea';
        render();
        const textAreaEdit = document.getElementById(`text${triggerFeed}${indexNr}`)
        textAreaEdit.style.height = `auto`;
        textAreaEdit.style.height = `${textAreaEdit.scrollHeight}px`;
        textAreaEdit.focus();
        textAreaEdit.selectionStart = textAreaEdit.value.length;
    }  
}


// Adds a new card to the to-do array and focuses the textarea.

 function addNewCard() {
    todoCards.unshift(new Card());
    addCardBtn.disabled = true;
    render();
    document.getElementById("texttodo0").focus();
}


// Updates card object listIndex property with the current one.

function updateCardIndex(list) {
    list.forEach(card => card.listIndex = list.indexOf(card));
}

// Updates card object positionY property with the current one.

function updateCardYPosition(list) {
    list.forEach(card => {
        const theCard = document.querySelector(`#${card.parentFeed}${card.listIndex}`);
        card.positionY = theCard.getBoundingClientRect().y + (theCard.getBoundingClientRect().height / 2);
    });
}


// Generates the HTML code of the Card object based on it's current properties.

 function generateHtml (card) {
    card.cardHtml = `
    <div class="card draggable" 
    draggable="true"
    id="${card.parentFeed}${card.listIndex}"
    data-index-number="${card.listIndex}"
    data-card-feed="${card.parentFeed}"
    >
        <${card.textWrapper} 
        data-index-number="${card.listIndex}"
        data-type="textarea"
            class="card-div textfield" 
            id="text${card.parentFeed}${card.listIndex}" 
            data-index-number="${card.listIndex}" 
            style="height:auto">${card.toDoText}</${card.textWrapper}>
        <div class="card-footer">
            <div class="date-created">${card.dateStarted}</div>
                <button 
                class="reverse-card-btn" 
                data-index-number="${card.listIndex}"
                data-type="reverse-card-btn"
                >
                    &#8592;
                </button>
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


// Rerenders the HTML page based on most recent available feed and card data.

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
    updateCardYPosition(todoCards);
    updateCardYPosition(doingCards);
    updateCardYPosition(doneCards);
    saveData();
}


// Saves data to local storage.

function saveData() {
    window.localStorage.setItem('todoFeed', JSON.stringify(todoCards));
    window.localStorage.setItem('doingFeed', JSON.stringify(doingCards));
    window.localStorage.setItem('doneFeed', JSON.stringify(doneCards));
}


// Loads data from local storage.

function getData() {
    todoCards = JSON.parse(window.localStorage.getItem('todoFeed')) ? JSON.parse(window.localStorage.getItem('todoFeed')) : [];
    doingCards = JSON.parse(window.localStorage.getItem('doingFeed')) ? JSON.parse(window.localStorage.getItem('doingFeed')) : [];
    doneCards = JSON.parse(window.localStorage.getItem('doneFeed')) ? JSON.parse(window.localStorage.getItem('doneFeed')) : [];
}






