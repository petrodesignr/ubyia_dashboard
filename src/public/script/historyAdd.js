// Sélectionne la checkbox et l'élément d'affichage
const checkbox = document.getElementById('dateCheckbox');
const dateTimeDisplay = document.getElementById('dateTimeDisplay');
const inputDate = document.getElementById('eventDate');

// Réinitialise l'état de la checkbox à décoché au chargement de la page
window.onload = function() {
    checkbox.checked = false;
    dateTimeDisplay.textContent = ''; // Effacer aussi l'affichage de la date/heure au besoin
  };
  

// Ajoute un écouteur d'événements sur le clic de la checkbox
checkbox.addEventListener('change', function() {
  if (checkbox.checked) {
    // empeche de pouvoir changer la date si la case est cochée
    inputDate.setAttribute('disabled','');
    const dateNow = new Date();
    dateTimeDisplay.textContent = `Date et Heure : ${dateNow.toLocaleString()}`;
  } else {
    dateTimeDisplay.textContent = ''; // Efface l'affichage si décoché
    // permet de pouvoir changer la date si la case est décochée
    inputDate.removeAttribute('disabled');
  }
});

