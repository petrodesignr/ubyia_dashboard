// controllers/dashboard.controller.js

const ticketModel = require("../models/ticket.model");


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

exports.getDashboard = async (req, res) => {
    try {
        const priority = await ticketModel.getPriority();
        const status = await ticketModel.getStatus();

        const limit = 10; // Nombre de tickets par page
        const page = parseInt(req.query.page) || 1; // Page actuelle (par défaut 1)
        const offset = limit * (page - 1); // Décalage SQL basé sur la page actuelle

        // Récupération des tickets et du total
        const tickets = await ticketModel.getAllTickets(limit, offset);
        const totalTickets = await ticketModel.getTotalTickets();
        const totalPages = Math.ceil(totalTickets / limit); // Total des pages

        res.render('tickets/dashboard', {
            tickets: tickets,
            priority: priority,
            status: status,
            currentPage: page, // Page actuelle
            totalTickets: totalTickets, // Nombre total de tickets
            totalPages: totalPages, // Total des pages
        });
    } catch (error) {
        console.error('Erreur dans getDashboard:', error);
        res.status(500).send('Erreur serveur');
    }
};

exports.getFilteredTickets = async (req, res) => {
    try {
        const { priority_id = '', status_id = '' } = req.body;

        const priority = await ticketModel.getPriority();
        const status = await ticketModel.getStatus();

        // const limit = 10; // Number of tickets per page
        // const page = parseInt(req.query.page) || 1; // Current page (default: 1)
        // const offset = limit * (page - 1); // SQL offset

         const tickets = await ticketModel.getTicketsByFilters(priority_id, status_id);
        // const totalTickets = await ticketModel.getTotalTickets();
        // const totalPages = Math.ceil(totalTickets / limit); // Total pages

        // console.log('Tickets:', tickets); // Log tickets fetched from the database

        if (tickets.length === 0) {
            return res.status(200).json({ data: [], message: 'No tickets available' });
        }

        res.status(200).json({ data: tickets, priority, status });
    } catch (error) {
        console.error('Error in getFilteredTickets:', error); // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




