class Card {
    constructor(){
        this.listIndex = 0;
        this.toDoText = '';
        this.textWrapper = 'textarea';
        this.parentFeed = 'todo'
        this.dateStarted = (new Date()).toLocaleString();
        // this.generateHtml();
    }
}
    // generateHtml = function() {
    //     this.cardHtml = `
    //     <div class="card">
    //         <${this.textWrapper} 
    //         data-index-number="${this.listIndex}"
    //         data-type="textarea"
    //             class="card-div textfield draggable" 
    //             id="card-div${this.listIndex}" 
    //             data-index-number="${this.listIndex}" 
    //             style="height:auto">${this.toDoText}</${this.textWrapper}>
    //         <div class="card-footer">
    //             <div class="date-created">${this.dateStarted}</div>
    //                 <button 
    //                     class="push-card-btn" 
    //                     data-index-number="${this.listIndex}"
    //                     data-type="push-card-btn"
    //                 >
    //                     &#8594;
    //                 </button>
    //         </div>  
    //         <button 
    //             class="close-card-btn"
    //             data-index-number="${this.listIndex}"
    //             data-type="close-card-btn"
    //         >
    //             &#10006;
    //         </button>
    //     </div>`

    // <button 
    //     class="card-collapse-btn" 
    //     data-index-number="${this.listIndex}"
    // >
    //     &#10550;
    // </button>
//     }
// }

export { Card }