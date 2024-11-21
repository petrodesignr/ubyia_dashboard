const { clientModel, serverModel } = require('../models/client.model');
const { v4: uuidv4 } = require('uuid');

exports.addClient = async (req, res) => {
    try {
        if (req.method === 'POST') {

            // Récupérer les données du corps de la requête des informations à vérifier
            const {
                company_lastname,
                company_firstname,
                company_position,
                company_email,
                company_phone,
                company_siret,
                company_postal_code,
            } = req.body;

            //Validation que lastname, firstname et position ne peuvent contenir que des lettres
            const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
            if (!nameRegex.test(company_lastname) || !nameRegex.test(company_firstname) || !nameRegex.test(company_position)) {
                return res.status(400).render('client/addClient', {
                    message: "Le nom, prénom et le poste ne peuvent contenir que des lettres",
                    formData: req.body
                });
            }

            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(company_email)) {
                return res.status(400).render('client/addClient', {
                    message: "Adresse e-mail invalide",
                    formData: req.body
                });
            }

            // Validation du numéro de téléphone
            if (company_phone.length !== 10 || isNaN(company_phone)) {
                return res.status(400).render('client/addClient', {
                    message: "Le numéro de téléphone doit contenir exactement 10 chiffres",
                    formData: req.body
                });
            }

            // Validation le nombre de numéro du SIRET
            if (company_siret.length !== 14 || isNaN(company_siret)) {
                return res.status(400).render('client/addClient', {
                    message: "Le numéro de SIRET doit contenir exactement 14 chiffres",
                    formData: req.body
                });
            }

            // Validation du numéro de code postal
            if (company_postal_code.length !== 5 || isNaN(company_postal_code)) {
                return res.status(400).render('client/addClient', {
                    message: "Le numéro de code postal doit contenir exactement 5 chiffres",
                    formData: req.body
                });
            }

            //les info du req.body sont celles qu'on veut récupérées alors il faut les ajouter au addClient de cette maniere car req.body est un objet qui contient formulaire
            const newClient = {
                company_id: uuidv4(),
                company_gender: req.body.company_gender,
                company_lastname: req.body.company_lastname,
                company_firstname: req.body.company_firstname,
                company_position: req.body.company_position,
                company_email: req.body.company_email,
                company_name: req.body.company_name,
                company_phone: req.body.company_phone,
                company_siret: req.body.company_siret,
                company_address: req.body.company_address,
                company_postal_code: req.body.company_postal_code,
                company_city: req.body.company_city
            }
            await clientModel.addClient(newClient);

            //pour ajout
            return res.redirect('clients');
        }
        //pour GET
        res.status(200).render('client/addClient');
    }
    catch (error) {
        //vérification si name ou SIRET sont déjà affectés à un client lors de l'ajout
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).render('client/addClient', {
                message: 'Le nom de l\'entreprise ou le SIRET existe déjà',
                formData: req.body
            });
        }
        res.status(500).render('404Error', { userName: 'erreur interne du serveur.' });
    }
};

exports.getAllClient = async (req, res) => {
    try {

        let clients;
        if (req.query.sortBy === 'date_desc') {
            clients = await clientModel.getClientsSortedByDate();
        } else {
            clients = await clientModel.getAllClient();
        }

        const countClient = await clientModel.countClient();
        // console.log(res.locals.staff);//voir ce qu'il y a dans le local
        res.status(200).render('client/client', { clients, countClient });

    } catch (error) {
        res.status(500).render('404Error', { userName: 'erreur lors de la récupération des clients.' })
    }
};

exports.searchClient = async (req, res) => {
    try {
        const query = req.query.query;
        const clients = await clientModel.searchClient(query);
        res.status(200).render('client/client', { clients, countClient: await clientModel.countClient() });
    } catch (error) {
        res.status(500).render('404Error', { userName: 'erreur lors de la recherche des clients' });
    }
};

exports.detailClient = async (req, res) => {
    try {
        const clientId = req.params.company_id;
        const clientArray = await clientModel.getClientById(clientId);
        const clients = clientArray;
        const isEditable = req.query.edit === 'true';

        // Rendre la page avec les détails du client
        res.status(200).render('client/detailClient', { clients, isEditable, staff: res.locals.staff });
    } catch (error) {
        console.error("Erreur dans detailClient:", error);
        res.status(500).render('404Error', { userName: 'Erreur lors de la récupération des détails du client.' });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const clientId = req.params.company_id;
        const {
            company_gender,
            company_lastname,
            company_firstname,
            company_position,
            company_email,
            company_name,
            company_phone,
            company_siret,
            company_address,
            company_postal_code,
            company_city
        } = req.body;

        // Expressions régulières pour les validations
        const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
        const siretPattern = /^\d{14}$/; // SIRET: 14 chiffres
        const phonePattern = /^(0[1-9][0-9]{8}|(\+33)[1-9][0-9]{8})$/; // Valide 10 chiffres ou format international
        const postalCodePattern = /^\d{5}$/;

        // Vérification des champs avec les regex
        if (
            !namePattern.test(company_lastname) ||
            !namePattern.test(company_firstname) ||
            !siretPattern.test(company_siret) ||
            !phonePattern.test(company_phone) ||
            !postalCodePattern.test(company_postal_code)
        ) { 
            const client = await clientModel.getClientById(clientId); // Récupérer le client même en cas d'erreur
            return res.status(200).render('client/detailClient', {
                clients: client,
                isEditable: true,
                staff: res.locals.staff,
                message: 'Veuillez fournir des données valides pour les champs.'
            });
        }

        // Récupérer les informations actuelles du client
        const client = await clientModel.getClientById(clientId);

        // Vérification des champs modifiés
        const isUpdated = (
            company_gender !== client.company_gender ||
            company_lastname !== client.company_lastname ||
            company_firstname !== client.company_firstname ||
            company_position !== client.company_position ||
            company_email !== client.company_email ||
            company_name !== client.company_name ||
            company_phone !== client.company_phone ||
            company_siret !== client.company_siret ||
            company_address !== client.company_address ||
            company_postal_code !== client.company_postal_code ||
            company_city !== client.company_city
        );

        if (isUpdated) {
            // Mise à jour du client
            await clientModel.updateClient(clientId, {
                company_gender,
                company_lastname,
                company_firstname,
                company_position,
                company_email,
                company_name,
                company_phone,
                company_siret,
                company_address,
                company_postal_code,
                company_city
            });
        }

        res.redirect('/client/clients');
    } catch (error) {
        console.error("Erreur dans updateClient:", error);
        res.status(500).render('404Error', { userName: 'Erreur lors de la mise à jour du client.' });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const clientId = req.params.company_id;

        // Vérification du rôle de l'utilisateur avant suppression
        if (res.locals.staff.id_role === 1) {
            await clientModel.deleteClient(clientId);
        }

        res.redirect('/client/clients');
    } catch (error) {
        console.error("Erreur dans deleteClient:", error);
        res.status(500).render('404Error', { userName: 'Erreur lors de la suppression du client.' });
    }
};


//afficher la liste des servers d'un client
exports.clientServer = async (req, res) => {
    try {
        const clientId = req.params.company_id;
        console.log(clientId); // Récupérer l'ID du client depuis les paramètres de la requête
        const clients = await clientModel.getClientById(clientId); // Récupérer les détails du client
        console.log(clients);
        const servers = await serverModel.getServersByClientId(clientId) || []; // Récupérer les serveurs associés à ce client
        console.log(servers);
        const countClientServer = await serverModel.countClientServer(clientId);

        // Rendre la vue avec les données du client et les serveurs associés
        return res.status(200).render('client/clientServer', { clients, servers, countClientServer });
    } catch (error) {
        console.error("Erreur dans clientServer:", error);
        res.status(500).render('404Error', { userName: 'Erreur lors de la récupération des détails du client et des serveurs.' });
    }
};

exports.updateServerClient = async (req, res) => {
    try {
        const id_company = req.params.id_company;
        const serial_number_ubybox = req.params.serial_number_ubybox;
        const contract_date_dissociation = new Date().toISOString().slice(0, 10);

        await serverModel.updateServerClient(id_company, serial_number_ubybox, contract_date_dissociation);


        res.redirect('/client/clientServer/' + id_company);
    } catch (error) {
        console.error("Erreur dans deleteServers:", error);
        res.status(500).render('home', { userName: 'Erreur lors de la suppression du serveur.' });
    }
};