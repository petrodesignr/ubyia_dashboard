// models/Ticket.js

const sql = require('./database');

const ticketModel = {
    getAllTickets: () => {
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
                GROUP BY 
                    t.ticket_id
                ORDER BY 
                    t.ticket_date_create ASC;
            `;

            sql.query(sqlRequest, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    },

    getStatus: () => {
        return new Promise((resolve, reject) => {
            const sqlRequest = `
                SELECT status_name FROM status
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
                SELECT priority_name FROM priority
            `;

            sql.query(sqlRequest, (err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    },

};

module.exports = ticketModel;
