document.getElementById("burger-menu").addEventListener("click", function() {
    var navList = document.getElementById("nav-list");
    navList.classList.toggle("show");
  });
  // Fermer le menu si on clique en dehors
document.addEventListener("click", function(event) {
    var navList = document.getElementById("nav-list");
    var burgerMenu = document.getElementById("burger-menu");
  
    // Vérifie si le clic est en dehors du menu ou de l'icône burger
    if (!navList.contains(event.target) && !burgerMenu.contains(event.target)) {
      navList.classList.remove("show");
    }
  });
  console.log("allo")