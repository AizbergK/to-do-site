
const addToDoBtn = document.querySelector
const cardTextArea = document.querySelector("#card-textarea");

cardTextArea.addEventListener("input", function() {
    this.style.height = `auto`
    this.style.height = `${this.scrollHeight}px`
});

`<div class="card">
    <textarea type="text" id="card-textarea"></textarea>
    <div class="card-footer">
        <div class="date-created">10 oct</div>
        <button class="card-collapse-btn">&#10550;</button>
        <button class="card-push-btn">&#10004;</button>
    </div>  
</div>`
