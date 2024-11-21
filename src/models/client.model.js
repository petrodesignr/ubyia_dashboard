const sql = require('./database');//connexion BDD

const clientModel = {

    //ajouter un client
    addClient: async function (formAddClient) {
        return new Promise(async (resolve, reject) => {
            const sqlRequest = `
                INSERT INTO company (company_id, company_gender, company_lastname, company_firstname, company_position, company_email, company_name, company_phone, company_siret, company_address, company_postal_code, company_city, company_date_create)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

            sql.query(sqlRequest,
                [
                    formAddClient.company_id,
                    formAddClient.company_gender,
                    formAddClient.company_lastname,
                    formAddClient.company_firstname,
                    formAddClient.company_position,
                    formAddClient.company_email,
                    formAddClient.company_name,
                    formAddClient.company_phone,
                    formAddClient.company_siret,
                    formAddClient.company_address,
                    formAddClient.company_postal_code,
                    formAddClient.company_city
                ],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res);
                }
            );
        });
    },

    //affichage de toutes les cards
    getAllClient: async function () {
        return new Promise((resolve, reject) => {
            const sqlRequest = 'SELECT * FROM company';
            sql.query(sqlRequest,
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res);
                })
        });
    },

    //permet de compter le nb de client que nous avons en BDD
    countClient: async function () {
        return new Promise((resolve, reject) => {
            const sqlRequest = 'SELECT COUNT(*) AS total FROM company';
            sql.query(sqlRequest, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result[0].total);
            })
        });
    },

    //permet de faire une recherche dans la page clientList
    searchClient: async function (query) {
        return new Promise((resolve, reject) => {
            const sqlRequest = `SELECT * FROM company WHERE company_id LIKE ? or company_name LIKE ? or company_lastname LIKE ? or company_firstname LIKE ? or company_email LIKE ? or company_city LIKE ?`;
            sql.query(sqlRequest, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`], (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    },

    /*Afficher les clients par date */
    getClientsSortedByDate : async function(query) {
        return new Promise((resolve, reject) => {
            const sqlRequest = `SELECT * FROM company ORDER BY company_date_create DESC`;
            sql.query(sqlRequest, [`%${query}%`], (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    },
    

    //affichage du détail d'un client
    getClientById: async function (clientId) {
        return new Promise((resolve, reject) => {
            const sqlRequest = 'SELECT * FROM company WHERE company_id = ?';
            sql.query(sqlRequest, [clientId],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    if (res.length === 0) {
                        return reject(new Error('Client non trouvé'));
                    }
                    return resolve(res[0]);
                })
        });
    },

    //mise à jour formulaire
    updateClient: async function (clientId, formUpdateClient) {
        return new Promise((resolve, reject) => {
            const sqlRequest = 'UPDATE company SET company_gender = ?, company_lastname = ?, company_firstname = ?, company_position = ?, company_email = ?, company_name = ?, company_phone = ?, company_siret = ?, company_address = ?, company_postal_code = ?, company_city = ? WHERE company_id = ?';
            sql.query(sqlRequest,
                [
                    formUpdateClient.company_gender,
                    formUpdateClient.company_lastname,
                    formUpdateClient.company_firstname,
                    formUpdateClient.company_position,
                    formUpdateClient.company_email,
                    formUpdateClient.company_name,
                    formUpdateClient.company_phone,
                    formUpdateClient.company_siret,
                    formUpdateClient.company_address,
                    formUpdateClient.company_postal_code,
                    formUpdateClient.company_city,
                    clientId
                ],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res);
                }
            );
        });
    },

    //delete(supprimer) un client
    deleteClient: async function (clientId) {
        return new Promise((resolve, reject) => {
            const sqlRequest = 'DELETE FROM company WHERE company_id = ?';
            sql.query(sqlRequest, [clientId], (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    },

};

const serverModel = {

    //récupérer le server associé à un client via l'id de celui-ci
    getServersByClientId: async function (clientId) {
        return new Promise((resolve, reject) => {
            try {
            const sqlRequest = 'SELECT ubybox.* FROM ubybox INNER JOIN contract ON ubybox.ubybox_serial_number = contract.serial_number_ubybox WHERE contract.id_company = ? AND contract_date_dissociation IS NULL';
            sql.query(sqlRequest, [clientId],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    } 
                    return resolve(res);
                });
            } catch (error) {
                return reject(error);
            }
        });
    },

    
    //permet de compter le nb de servers au client que nous avons en BDD
    countClientServer: async function (clientId) {
        return new Promise((resolve, reject) => {
            const sqlRequest = 'SELECT COUNT(*) AS total FROM contract WHERE id_company = ? AND contract_date_dissociation IS NULL';
            sql.query(sqlRequest, [clientId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result[0].total);
            })
        });
    },


        //delete(supprimer) un serveur d'un client
        updateServerClient: async function (id_company, serial_number_ubybox, contract_date_dissociation) {
            return new Promise((resolve, reject) => {
                const sqlRequest = 'UPDATE contract SET contract_date_dissociation = ? WHERE id_company = ? AND serial_number_ubybox = ?';
                sql.query(sqlRequest, [contract_date_dissociation, id_company, serial_number_ubybox], (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res);
                });
            });
        },

};
module.exports = {clientModel, serverModel};