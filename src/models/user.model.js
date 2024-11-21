const sql = require('./database');

const User = function () {
};

//récupération staff selon email
User.getOneStaffByEmail = async function (email) {
    return new Promise((resolve, reject) => {
        const sqlRequest = `SELECT * FROM staff WHERE staff_email = ?`;
        sql.query(sqlRequest, [email], (err, res) => {
            if (err) {
                return reject(err);
            }
            if (res.length === 0 || !res) {
                return resolve(null);
            }
            return resolve(res[0]);  // retourne le premier résultat (email unique)
        });
    });
};
//faire une autre requete pour définir niveau accès/role

User.getOneByEmail = (email) => {

    return new Promise(async (resolve, reject) => {

        try {

            const sqlRequest = ` SELECT  user_email,
                                                user_firstname,
                                                user_lastname,
                                                user_password,
                                                user_id,
                                                user.id_company,
                                                user_is_admin,
                                                company_name,
                                                b.box_ip_connexion
                                        FROM user
                                        LEFT JOIN company ON user.id_company = company.company_id
                                        LEFT JOIN eboo_v2.box b on company.company_id = b.id_company
                                        WHERE user_email = ?`;

            sql.query(sqlRequest, [email], (err, res) => {

                if (err) {
                    return reject(err);
                }

                if (res.length === 0 || !res) {
                    return resolve(null);
                }

                return resolve(res[0]);
            });

        } catch (e) {
            return reject(e);
        }
    })
};


module.exports = User;
