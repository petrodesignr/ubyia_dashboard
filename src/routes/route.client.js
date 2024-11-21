const express           = require('express');
const router            = express.Router();
const sessionAuth = require("../middlewares/middleware.session.js");
const ClientListController = require("../controllers/controller.client.js");


//afficher formulaire ajout client
router.get('/addClient', sessionAuth, ClientListController.addClient);

//soumettre formulaire ajout client
router.post('/addClient', sessionAuth, ClientListController.addClient);

//afficher tous les clients
router.get('/clients', sessionAuth, ClientListController.getAllClient);

//permet de faire une recherche
router.get('/search',  sessionAuth, ClientListController.searchClient);

// afficher le détail d'un client
router.get('/detailClient/:company_id', sessionAuth, ClientListController.detailClient);

// mettre à jour la fiche client
router.put('/detailClient/:company_id', sessionAuth, ClientListController.updateClient);

// supprimer une fiche client
router.delete('/detailClient/:company_id', sessionAuth, ClientListController.deleteClient);

//pour afficher la liste des servers d'un client
router.get('/clientServer/:company_id', sessionAuth, ClientListController.clientServer);

// supprimer un serveur d'un client -> la partie serial_number_ubybox est le nom du serveur 
// et permet de faire comprendre que c'est lui qui est dissocier vis a vis du client sans qu'il soit delete de la BDD
router.put('/clientServer/:id_company/:serial_number_ubybox', sessionAuth, ClientListController.updateServerClient);

module.exports = router;
