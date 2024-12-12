// models/Ticket.js

// const { get } = require('../routes/route.dashboard');
const sql = require('./database');

const ticketModel = {

    getAllTickets: (limit, offset) => {
        return new Promise((resolve, reject) => {
            const sqlRequest = `
            SELECT 
                m.message_date_create,
                t.ticket_date_create,
                s.staff_last_name,
                s.staff_first_name,
                t.ticket_id,
                t.id_user,
                p.priority_name,
                st.status_name,
                t.ubybox_serial_number,
                u.user_firstname,
                u.user_lastname,
                u.user_email,
                c.company_name
            FROM 
                message m
            LEFT JOIN 
                staff s ON m.id_staff = s.staff_id
            INNER JOIN 
                ticket t ON m.id_ticket = t.ticket_id
            INNER JOIN
                status st ON t.id_status = st.status_id
            INNER JOIN 
                priority p ON t.id_priority = p.priority_id
            INNER JOIN 
                user u ON t.id_user = u.user_id
            INNER JOIN 
                company c ON u.id_company = c.company_id
            GROUP BY 
                t.ticket_id
            ORDER BY 
                t.ticket_date_create ASC
            LIMIT ? OFFSET ?;
        `;

            sql.query(sqlRequest, [limit, offset], (err, res) => {
                if (err) {
                    console.error('SQL Error:', err);
                    return reject(err);
                }
                resolve(res);
            });
        });
    },

    getTotalTickets: () => {
        return new Promise((resolve, reject) => {
            const sqlRequest = `
                SELECT COUNT(*) AS totalTickets
                FROM ticket;
            `;
            sql.query(sqlRequest, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res[0].totalTickets); // Assuming it returns one row with totalTickets
            });
        });
    },

    getStatus: () => {
        return new Promise((resolve, reject) => {
            const sqlRequest = `
                SELECT status_id, status_name FROM status
            `;

            sql.query(sqlRequest, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    },

    getPriority: () => {
        return new Promise((resolve, reject) => {
            const sqlRequest = `
                SELECT priority_id, priority_name FROM priority
            `;

            sql.query(sqlRequest, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    },

    updatePriority: (ticketId, priority) => {
        return new Promise((resolve, reject) => {
            const sqlRequest = `
                UPDATE ticket SET id_priority = ? WHERE ticket_id = ?
            `;

            sql.query(sqlRequest, [priority, ticketId], (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    },

    updateStatus: (ticketId, status) => {
        return new Promise((resolve, reject) => {
            const sqlRequest = `
                UPDATE ticket SET id_status = ? WHERE ticket_id = ?
            `;

            sql.query(sqlRequest, [status, ticketId], (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    },


    getTicketsByFilters: (priority, status, staff, limit, offset) => {
        return new Promise((resolve, reject) => {

            console.log('Filters:', { priority, status, staff, limit, offset }); // Debug log

            let sqlRequest = `
            SELECT 
                m.message_date_create,
                t.ticket_date_create,
                s.staff_last_name,
                s.staff_first_name,
                t.ticket_id,
                t.id_user,
                p.priority_name,
                st.status_name,
                t.ubybox_serial_number,
                u.user_firstname,
                u.user_lastname,
                u.user_email,
                c.company_name
            FROM 
                message m
            INNER JOIN 
                staff s ON m.id_staff = s.staff_id
            INNER JOIN 
                ticket t ON m.id_ticket = t.ticket_id
            INNER JOIN
                status st ON t.id_status = st.status_id
            INNER JOIN 
                priority p ON t.id_priority = p.priority_id
            INNER JOIN 
                user u ON t.id_user = u.user_id
            INNER JOIN 
                company c ON u.id_company = c.company_id
        `;

            const conditions = [];
            const params = [];

            if (priority) {
                conditions.push("p.priority_id IN (?)");
                params.push(priority);
            }

            if (status) {
                conditions.push("st.status_id IN (?)");
                params.push(status);
            }

            if (staff) {
                conditions.push("s.staff_id IN (?)");
                params.push(staff);
            }

            if (conditions.length > 0) {
                sqlRequest += ` WHERE ${conditions.join(' AND ')}`;
            }

            sqlRequest += `
            GROUP BY 
                t.ticket_id
            ORDER BY 
                t.ticket_date_create ASC
            LIMIT ? OFFSET ?;
        `;

            params.push(limit, offset); // Add limit and offset to the params array

            console.log('Generated SQL Query:', sqlRequest); // Log query
            console.log('Query Parameters:', params); // Log parameters
            sql.query(sqlRequest, params, (err, res) => {
                if (err) {
                    console.error('SQL Error:', err);
                    return reject(err);
                }
                resolve(res);
            });
        });
    },




};



module.exports = ticketModel;
