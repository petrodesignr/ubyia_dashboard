const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const bcrypt = require("bcrypt");
const path = require('path');

exports.signIn = async (req, res) => {

    try {

        if (!req.body.userEmail || !req.body.userPassword) {
            return res.status(400).json({ error: true, response: null, message: 'Certains champs sont manquants' });
        }

        const dataUser = await userModel.getOneByEmail(req.body.userEmail);

        console.log('-dataUser--->', dataUser);

        if (!dataUser) {
            return res.status(401).json({ error: true, response: null, message: 'Email ou mot de passe incorrect !' });
        }

        const goodPassword = await bcrypt.compare(req.body.userPassword, dataUser.user_password);

        if (!goodPassword) {

            return res.status(401).json({ error: true, response: null, message: 'Email ou mot de passe incorrect !' });
        }

        const user = {
            idUser: dataUser.user_id, userEmail: req.body.userEmail, idCompany: dataUser.id_company
        }

        const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });

        const DataUserToSend = {
            firstName: dataUser.user_firstname,
            lastName: dataUser.user_lastname,
            compagny: dataUser.company_name,
            isAdmin: dataUser.user_is_admin,
            ipUbyBox: user.box_ip_connexion
        }

        return res.status(200).json({ token: accessToken, dataUser: DataUserToSend });

    } catch (e) {
        console.log('e', e);
        res.status(500).json({ error: true, response: null, message: null });
    }
};

exports.signUp = async (req, res) => {



    try {



        return res.status(200).json({ accessToken });

    } catch (e) {


    }
};

//permet l'envoi de formulaire de connexion de compte Staff
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        if (req.method === 'POST') {
            const staff = await userModel.getOneStaffByEmail(email);
            console.log(staff);
            if (staff == null) {
                console.log(staff, 'pas de correspondance');
                return res.status(401).render('login');
            }
            if (password !== staff.staff_password) {
                console.log(password, 'pas de correspondance de mdp');
                return res.status(401).render('login');
            }
            res.cookie('follow', email);
            console.log('follow', req.cookies);

            return res.redirect('/clientList/clients');
        } else if (req.method === 'GET') {
            return res.render('login');

        }
    } catch (e) {

    };

};

exports.logout = (req, res) => {
    res.clearCookie('follow');//supprime le cookie à la déconnexion
    req.session.destroy((err) => {
        if (err) {
            console.error('erreur de déconnexion', err);
            return res.redirect('/clientList/clients');
        }
        res.redirect('/user/login');//permet d'etre renvoyer à la page de connexion
    })
}
exports.homePage = async (req, res) => {

    try {

        res.render(path.join(__dirname, '..', 'view', 'home.html'), {
            country: 'en',
            userName: "Bob"
        });

    } catch (e) {

        console.log('e', e);
        res.render(path.join(__dirname, '..', 'view', 'home.html'), {
            country: 'en',
            userName: "Bob"
        });
    }
};
