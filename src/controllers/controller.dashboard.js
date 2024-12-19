// controllers/dashboard.controller.js

const ticketModel = require("../models/ticket.model");
const moment = require('moment');



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

// exports.getDashboard = async (req, res) => {
//     try {
//         const priority = await ticketModel.getPriority();
//         const status = await ticketModel.getStatus();

//         const limit = 10; // Nombre de tickets par page
//         const page = parseInt(req.query.page) || 1; // Page actuelle (par défaut 1)
//         const offset = limit * (page - 1); // Décalage SQL basé sur la page actuelle

//         // Récupération des tickets et du total
//         const tickets = await ticketModel.getAllTickets(limit, offset);
//         const totalTickets = await ticketModel.getTotalTickets();
//         const totalPages = Math.ceil(totalTickets / limit); // Total des pages

//         res.render('tickets/dashboard', {
//             tickets: tickets,
//             priority: priority,
//             status: status,
//             currentPage: page, // Page actuelle
//             totalTickets: totalTickets, // Nombre total de tickets
//             totalPages: totalPages, // Total des pages
//         });
//     } catch (error) {
//         console.error('Erreur dans getDashboard:', error);
//         res.status(500).send('Erreur serveur');
//     }
// };

exports.getFilteredTickets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { priority_id, status_id, staff_id, startDate, endDate } = req.query;

        const currentStatus = status_id ? parseInt(status_id, 10) : null;
        const currentPriority = priority_id ? parseInt(priority_id, 10) : null;
        const currentStaff = staff_id ? staff_id : null;

        if (isNaN(page) || page <= 0) {
            return res.status(400).json({ error: 'Page must be a positive number' });
        }

        const limit = 10;
        const offset = limit * (page - 1);

        const priority = await ticketModel.getPriority();
        const status = await ticketModel.getStatus();

        const tickets = await ticketModel.getTicketsByFilters(priority_id, status_id, staff_id, limit, offset, startDate, endDate);
        const totalTickets = await ticketModel.getTotalTickets(priority_id, status_id, staff_id, startDate, endDate);
        const totalPages = Math.ceil(totalTickets / limit);

        res.render('tickets/dashboard', {
            tickets,
            totalTickets,
            totalPages,
            priority,
            status,
            currentStatus,
            currentPriority,
            currentStaff,
            currentPage: page,
            startDate: startDate || moment().startOf('day').format('YYYY-MM-DD'),
            endDate: endDate || moment().endOf('day').format('YYYY-MM-DD'),
            dateNow: moment().format('DD/MM/YYYY'),
            moment // Pass moment to the EJS template
        });
    } catch (error) {
        console.error('Error in getFilteredTickets:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};






// exports.getDashboard = async (req, res) => {
//     try {
//         console.log('Received Request Params:', req.params);
//         console.log('Received Query Params:', req.query);

//         // Combine route params and query params
//         const { priority_id, status_id } = req.params;
//         const { staff_id } = req.query;

//         // Validate and parse page
//         const page = parseInt(req.params.page, 10) || 1;
//         if (page <= 0) {
//             return res.status(400).json({ error: 'Invalid page number' });
//         }

//         const limit = 10; // Tickets per page
//         const offset = limit * (page - 1);

//         // Fetch priorities and statuses
//         const priority = await ticketModel.getPriority();
//         const status = await ticketModel.getStatus();

//         // Fetch tickets
//         const tickets = await ticketModel.getTicketsByFilters(priority_id, status_id, staff_id, limit, offset);
//         const totalTickets = await ticketModel.getTotalTickets();
//         const totalPages = Math.ceil(totalTickets / limit);

//         console.log('Tickets:', tickets);

//         // Return response
//         if (tickets.length === 0) {
//             return res.status(200).json({ data: [], message: 'No tickets available' });
//         }

//         res.render('tickets/dashboard', {
//             tickets: tickets,
//             priority: priority,
//             status: status,
//             currentPage: page, // Page actuelle
//             totalTickets: totalTickets, // Nombre total de tickets
//             totalPages: totalPages, // Total des pages
//         });
//     } catch (error) {
//         console.error('Error in getFilteredTickets:', error);
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
// };






