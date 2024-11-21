function toggleMenu(burgerIcon) {
    const menuContent = burgerIcon.nextElementSibling; // Trouve le menu juste après l'icône cliquée
    menuContent.style.display = (menuContent.style.display === 'grid') ? 'none' : 'grid';
}

// Cacher tous les menus burger quand la fenêtre est redimensionnée au-dessus de 780px
function checkWindowSize() { 
    if (window.innerWidth > 780) {
        document.querySelectorAll('.menu-burger-content').forEach(menu => {// Trouve tous les menus burger ayant la classe "menu-burger-content"
            menu.style.display = 'none';
        });
    }
}

window.addEventListener('resize', checkWindowSize);
window.addEventListener('load', checkWindowSize);

