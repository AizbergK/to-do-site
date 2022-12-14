import { Card } from "./card.js";


// MAIN HTML OBJECTS

const addCardBtn = document.querySelector("#add-card-btn");
const toDoFeed = document.querySelector("#todo-card-container");
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

toDoFeed.addEventListener("keydown", saveTextInput);
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
let cardHeight;
let cardWidth;
let cardVerticalPosition;
let cardHorizontalPosition;

const dragStartEvent = "dragstart";
const dragEndEvent = "dragend";
const dragOverEvent = "dragover";

draggableCards.forEach(draggable => {

    draggable.addEventListener(dragStartEvent, function(e) { 
        if(notInEditing) {
            let dragCard = e.target.cloneNode(true);
            dragCard.id = "opaque";
            e.target.classList.toggle("dragging");
            document.querySelector(".container").appendChild(dragCard);
            e.dataTransfer.setDragImage(e.target, e.target.getBoundingClientRect().width/2, e.target.getBoundingClientRect().height/2);
            cardHeight = e.target.getBoundingClientRect().height / 2;
            cardWidth = e.target.getBoundingClientRect().width / 2;
        }
    }, false)

    draggable.addEventListener(dragEndEvent, function(e) {
        e.target.classList.toggle("dragging");
        if(draggedFeedOrigin != draggedFeedTarget){
            moveCard(draggedCardIndex, draggedFeedTarget, draggedFeedOrigin, targetFeedIndex);
            render();
        } else {
            if(draggedCardIndex < targetFeedIndex){
                moveCard(draggedCardIndex, draggedFeedTarget, draggedFeedOrigin, targetFeedIndex);
                render();
            } else if(draggedCardIndex > targetFeedIndex) {
                moveCard(draggedCardIndex, draggedFeedTarget, draggedFeedOrigin, targetFeedIndex);
                render();
            }
        }
        document.getElementById("opaque").remove();
    })

    draggable.addEventListener(dragOverEvent, function(e) {
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
        const targetHtmlFeed = document.querySelector(`#${draggedFeedTarget}-card-container`);
        const elementAfterHtml = getDraggedAfterHtmlElement(targetHtmlFeed, e.clientY);
        if(elementAfterHtml == null) {
            draggable.appendChild(dragged);
        } else {
            draggable.insertBefore(dragged, elementAfterHtml);
        }
        
    })
})

function getDraggedAfterHtmlElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if(offset < 0 && offset > closest.offset) {
            return { 
                offset: offset,
                element: child}
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function getTargetFeedIndex(mouseY, feed) {
    return feed.findLast(card => (mouseY - card.positionY) > 0).listIndex + 1;
}

const draggingPosition = document.getElementById("container");

draggingPosition.addEventListener(dragStartEvent, function(e) {
    setTimeout(() => {
        e.preventDefault()
        cardVerticalPosition = e.clientY;
        cardHorizontalPosition = e.clientX;
        const shadowElement = document.getElementById("opaque");
        shadowElement.style.top = `${cardVerticalPosition - cardHeight}px`;
        shadowElement.style.left = `${cardHorizontalPosition - cardWidth}px`;
    }, 0);
})

draggingPosition.addEventListener(dragOverEvent, function(e) {
    e.preventDefault()
    cardVerticalPosition = e.clientY;
    cardHorizontalPosition = e.clientX;
    const shadowElement = document.getElementById("opaque");
    shadowElement.style.top = `${cardVerticalPosition - cardHeight}px`;
    shadowElement.style.left = `${cardHorizontalPosition - cardWidth}px`;
})

draggableCards.forEach(draggable => {
    draggable.addEventListener("scroll", () => {
        updateCardYPosition(todoCards);
        updateCardYPosition(doingCards);
        updateCardYPosition(doneCards);
        console.log("HI")
    })
})

// Limits maximum textareas in editing to 1

let notInEditing = true;


// Dynamically resize textarea according to current text height. Saves
// current text on losing focus or Enter and removes the card if it is empty and 
// save input is received. Toggles text wrapper from <textarea> to <p>

function saveTextInput(e) {
    const triggeredArray = returnFeed(e.currentTarget.dataset.feed);
    const modularId = /(texttodo|textdoing|textdone)\d+/;
    if(modularId.test(e.target.id)) {
        e.srcElement.style.height = `auto`;
        e.srcElement.style.height = `${e.srcElement.scrollHeight}px`;
        if(e.key == "Enter") {
            e.target.blur();
        }
        if(e.type == "focusout") {
            if(e.target.value == ""){
                triggeredArray.splice(e.target.dataset.indexNumber, 1);
                addCardBtn.disabled = false;
                notInEditing = true;
            } else {
                const indexNr = e.target.dataset.indexNumber;
                let cleanUserInput = DOMPurify.sanitize(e.target.value, {ALLOWED_TAGS: [], KEEP_CONTENT: false});
                triggeredArray[indexNr].toDoText = cleanUserInput;
                if(cleanUserInput == "") {
                    triggeredArray.splice(e.target.dataset.indexNumber, 1);
                    addCardBtn.disabled = false;
                    notInEditing = true;
                } else {
                    triggeredArray[indexNr].textWrapper = 'p';
                    addCardBtn.disabled = false;
                    notInEditing = true;
                }
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
    const rollInCard = e.target.parentElement.parentElement.cloneNode(true);
    if(e.target.dataset.type == "push-card-btn") {
        
        const insertRollInCard = document.querySelector(`#${returnNewParentFeed(e.currentTarget.dataset.feed)}-card-container`);
        rollInCard.classList.toggle("slide-in-left");
        insertRollInCard.insertBefore(rollInCard, insertRollInCard.firstChild);
        
        const index = e.target.dataset.indexNumber;
        const triggeredArray = e.currentTarget.dataset.feed;
        const targetArray = returnNewParentFeed(e.currentTarget.dataset.feed);
        e.target.parentElement.parentElement.classList.toggle("slide-out-right")
        toggleButtonDisabled();
        setTimeout(() => {
        moveCard(index, targetArray, triggeredArray);
        render();
        // toggleButtonDisabled();
        }, 190)
    } else if(e.target.dataset.type == "reverse-card-btn") {

        const insertRollInCard = document.querySelector(`#${returnNewParentFeed(e.currentTarget.dataset.feed, -1)}-card-container`);
        rollInCard.classList.toggle("slide-in-right");
        insertRollInCard.insertBefore(rollInCard, insertRollInCard.firstChild);

        const index = e.target.dataset.indexNumber;
        const triggeredArray = e.currentTarget.dataset.feed;
        const targetArray = returnNewParentFeed(e.currentTarget.dataset.feed, -1);
        e.target.parentElement.parentElement.classList.toggle("slide-out-left")
        toggleButtonDisabled();
        setTimeout(() => {
        moveCard(index, targetArray, triggeredArray);
        render();
        // toggleButtonDisabled();
        }, 190)
    }
}

function toggleButtonDisabled() {
    const pushForwardButtons = document.querySelectorAll(".push-card-btn");
    const pushBackwardsButtons = document.querySelectorAll(".reverse-card-btn");
    pushForwardButtons.forEach(button => button.disabled = !button.disabled);
    pushBackwardsButtons.forEach(button => button.disabled = !button.disabled);
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
    // render();

}


// Checks the HTML object dataset for the unique ID attributed to textarea and
// changes toggles the text wrapper from <textarea> to <p> and automatically
// adjusts textarea height based on text height on keypress.

function changeTextWrapper(e) {
    const triggerFeed = e.currentTarget.dataset.feed;
    const triggeredArray = returnFeed(triggerFeed);
    const indexNr = e.target.dataset.indexNumber;
    if(e.target.dataset.type == "textarea") {
        if(triggeredArray[indexNr].textWrapper == 'p' && notInEditing) {
            notInEditing = false;
            addCardBtn.disabled = true;
            triggeredArray[indexNr].textWrapper = 'textarea';
            render();
            const cardInEditing = document.getElementById(`${triggerFeed}${indexNr}`);
            cardInEditing.draggable = false;
            const textAreaEdit = document.getElementById(`text${triggerFeed}${indexNr}`)
            textAreaEdit.style.height = `auto`;
            textAreaEdit.style.height = `${textAreaEdit.scrollHeight}px`;
            textAreaEdit.focus();
            textAreaEdit.selectionStart = textAreaEdit.value.length;
        }  
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
            style="height:auto">${card.toDoText}</${card.textWrapper}
        >
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
    console.log("RENDER")
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


