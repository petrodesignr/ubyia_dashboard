// Sélection des éléments
const divEntry = document.querySelectorAll('div.entry');
const cancelDeleteBtn = document.querySelector('div.deletePopup form div.cancelBtn');
const popup = document.querySelector('div.deletePopup');
const disabled = document.querySelectorAll('div.entry-header');

divEntry.forEach(element => {
    element.querySelector('a.deleteIcon').addEventListener('click', (e)=>{
        element.querySelector('div.deletePopup').classList.add('activated');
        disabled.forEach(elem =>{
            elem.classList.add('disabledContainer')
        });
    })
  element.querySelector('div.deletePopup form div.cancelBtn').addEventListener('click', function(elem) {
    console.log(elem);
    element.querySelector('div.deletePopup').classList.remove('activated');
    disabled.forEach(elem =>{
        elem.classList.remove('disabledContainer')
    });
});
});





