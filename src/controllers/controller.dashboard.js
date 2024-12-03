// controllers/dashboard.controller.js

const ticketModel = require("../models/ticket.model");

exports.getDashboard = async (req, res) => {
    try {
        const tickets = await ticketModel.getAllTickets();
        const priority = await ticketModel.getPriority();
        const status = await ticketModel.getStatus();

        if (tickets.length === 0) {
            return res.status(200).send({ tickets: [] });
        }
        // console.log(dashboard); // Check what data is being fetched
        res.render('tickets/dashboard', { tickets: tickets, priority: priority, status: status }); // Pass tickets
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
};


exports.updatePriority = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const priority = req.body.priority;

        await ticketModel.updatePriority(ticketId, priority);
        // await ticketModel.updatePriority(ticketId, priority);
        // res.redirect('tickets/dashboard');
        res.status(200).send('Priorité mise à jour');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const status = req.body.status;

        await ticketModel.updateStatus(ticketId, status);
        res.status(200).send('Statut mis à jour');
    } catch (error) {   
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
};