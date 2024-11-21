// Sélection des éléments
const popup = document.querySelector('div.deletePopup');
const openPopupBtn = document.getElementById('openPopup');
const cancelDeleteBtn = document.querySelector('div.deletePopup form div.cancelBtn');
const container = document.querySelector('div.container');

// Fonction pour afficher la popup
openPopupBtn.addEventListener('click', function() {
    popup.classList.toggle('activated');
   container.classList.toggle('disabledContainer');
});

// Fonction pour fermer la popup en cliquant sur 'Annuler'
cancelDeleteBtn.addEventListener('click', function() {
    popup.classList.toggle('activated');
    container.classList.toggle('disabledContainer');
});