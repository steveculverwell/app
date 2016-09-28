function Dialog(dialogEl, overlayEl) {

    this.dialogEl = dialogEl; // document.querySelector('.dialog')
    this.overlayEl = overlayEl; //document.querySelector('.dialog-overlay')
    this.focusedElBeforeOpen;


    // When first opened, focus should be set to the first focusable element within the dialog
    // To achieve this, we need to generate an array of all the focusable elements within the dialog.  
    var focusableEls = this.dialogEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
    this.focusableEls = Array.prototype.slice.call(focusableEls);

    this.firstFocusableEl = this.focusableEls[0];
    this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];

    this.close();
}

// Easy access to the prototype
var DialogProto = Dialog.prototype;


DialogProto.open = function(){
    
    var Dialog = this;
    console.log(Dialog);

    this.dialogEl.removeAttribute('aria-hidden');
    this.overlayEl.removeAttribute('aria-hidden');

    // Get the currently focused element in the document
    this.focusedElBeforeOpen = document.activeElement;

    this.dialogEl.addEventListener('keydown', function(e){
        Dialog._handleKeyDown(e);
    });

    this.overlayEl.addEventListener('click', function(e){
        Dialog.close();
    });

    this.firstFocusableEl.focus();

};

DialogProto.close = function(){
    
    this.dialogEl.setAttribute('aria-hidden', true);
    this.overlayEl.setAttribute('aria-hidden', true);

    if(this.focusedElBeforeOpen) {
        this.focusedElBeforeOpen.focus();
    }

};

DialogProto._handleKeyDown = function(e){
    
    var Dialog = this;
    var KEY_TAB = 9;
    var KEY_ESC = 27;

    function handleBackwardTab(){
        if (document.activeElement === Dialog.firstFocusableEl){
            e.preventDefault();
            Dialog.lastFocusableEl.focus();
        }
    }

    function handleForwardTab(){
        if (document.activeElement === Dialog.lastFocusableEl) {
            e.preventDefault();
            Dialog.firstFocusableEl.focus();
        }
    }

    switch(e.keyCode){
        case KEY_TAB:
            if ( Dialog.focusableEls.length === 1 ) {
                e.preventDefault();
                break;
            } 
            if ( e.shiftKey ) {
                handleBackwardTab();
            } else {
                handleForwardTab();
            }
        break;
        case KEY_ESC:
            Dialog.close();
            break;
        default: 
            break;
    }
};


DialogProto.addEventListeners = function(openDialogSel, closeDialogSel){

    var Dialog = this;
    
    var openDialogEls = document.querySelectorAll(openDialogSel);
    for(var i=0; i < openDialogEls.length; i++){
        openDialogEls[i].addEventListener('click', function(){
            Dialog.open();
        });
    }

    var closeDialogEls = document.querySelectorAll(closeDialogSel);
    for(var i=0; i < closeDialogEls.length; i++){
        closeDialogEls[i].addEventListener('click', function(){
            Dialog.close();
        });
    }    
};

