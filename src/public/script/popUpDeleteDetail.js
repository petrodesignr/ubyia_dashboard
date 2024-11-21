const deletebtn = document.querySelector('li#buttonDetailSection button.valid')
const popup = document.querySelector('section#deletePopupServer')

deletebtn.addEventListener('click', () => {
    popup.classList.add('active')
})

popup.querySelector('form div a#cancelPopup').addEventListener('click', () => {
    popup.classList.remove('active')
})