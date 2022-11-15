
const addCardBtn = document.querySelector("#add-card-btn");
const toDoFeed = document.querySelector("#to-do-card-container");
let todoCards = [];
let doingCards = [];
let doneCards = [];
let date = new Date()
console.log((new Date()).toLocaleString())

toDoFeed.addEventListener("keypress", saveTextInput);
toDoFeed.addEventListener("click", changeTextWrapper);
addCardBtn.addEventListener("click", addNewCard);

let notInEditing = true;

function saveTextInput(e) {
    const modularId = /card-div\d+/;
    if(modularId.test(e.target.id)){
        e.srcElement.style.height = `auto`;
        e.srcElement.style.height = `${e.srcElement.scrollHeight}px`;
        if(e.key == "Enter"){
            const indexNr = e.target.dataset.indexNumber;
            todoCards[indexNr].toDoText = e.target.value;
            todoCards[indexNr].textWrapper = 'p';
            addCardBtn.disabled = false;
            notInEditing = true;
            render();
        }
    }
}

function changeTextWrapper(e) {
    const indexNr = e.target.dataset.indexNumber;
    if(todoCards[indexNr].textWrapper != 'textarea' && notInEditing) {
        notInEditing = false;
        addCardBtn.disabled = true;
        todoCards[indexNr].textWrapper = 'textarea';
        render();
        console.log(e.target)
        const textAreaEdit = document.getElementById(`card-div${indexNr}`)
        textAreaEdit.style.height = `auto`;
        textAreaEdit.style.height = `${textAreaEdit.scrollHeight}px`;
        document.getElementById(`card-div${indexNr}`).focus();
    }  
}

 function addNewCard() {
    todoCards.unshift(new Card());
    todoCards.forEach(card => card.listIndex = todoCards.indexOf(card));
    addCardBtn.disabled = true;
    render();
    document.getElementById("card-div0").focus();
}

class Card {
    constructor(){
        this.listIndex = 0;
        this.toDoText = '';
        this.textWrapper = 'textarea';
        this.dateStarted = (new Date()).toLocaleString();
        this.generateHtml();
    }

    generateHtml = function() {
        this.cardHtml = `
        <div class="card">
            <${this.textWrapper} 
                class="card-div textfield draggable" 
                id="card-div${this.listIndex}" 
                data-index-number="${this.listIndex}" 
                style="height:auto">${this.toDoText}</${this.textWrapper}>
            <div class="card-footer">
                <div class="date-created">${this.dateStarted}</div>



                    <button 
                        class="card-push-btn" 
                        data-index-number="${this.listIndex}"
                    >
                        &#8594;
                    </button>
            </div>  
        </div>`

    // <button 
    //     class="card-collapse-btn" 
    //     data-index-number="${this.listIndex}"
    // >
    //     &#10550;
    // </button>
    }
}

function render() {
    toDoFeed.innerHTML = '';
    todoCards.forEach(element =>{
        element.generateHtml();
        toDoFeed.innerHTML += element.cardHtml;
    });
}



