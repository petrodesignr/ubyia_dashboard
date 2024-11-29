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

