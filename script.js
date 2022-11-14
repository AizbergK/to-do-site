
const addCardBtn = document.querySelector("#add-card-btn");
const toDoFeed = document.querySelector("#to-do-card-container");
let todoCards = [];
let doingCards = [];
let doneCards = [];
let date = new Date()
console.log(date.toLocaleString())


toDoFeed.addEventListener("input", autoHeight);

function autoHeight(e) {
    console.log(e);
    if(e.target.id == "card-textarea"){
        e.srcElement.style.height = `auto`;
        e.srcElement.style.height = `${e.srcElement.scrollHeight}px`;
    }

};

function cardGenerator(obj) {
    return
}

addCardBtn.addEventListener("click", function () {
    todoCards.unshift(`
    <div class="card">
        <textarea type="text" class="card-textarea" id="card-textarea" style="height:auto"></textarea>
        <div class="card-footer">
            <div class="date-created">10 oct</div>
            <button class="card-collapse-btn">&#10550;</button>
            <button class="card-push-btn">&#10004;</button>
        </div>  
    </div>`);
    render();
});

function render () {
    toDoFeed.innerHTML = '';
    todoCards.forEach(element => toDoFeed.innerHTML += element);

}



