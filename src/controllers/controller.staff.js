const staffModel = require("../models/staff.model");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

//Function de creation de compte
exports.accountCreation = async (req, res) => {
  try {
    if (req.method === "GET") {
      return res.render("connexion/accountCreation", { message: "" });
    } else if (req.method === "POST") {
      // recuperer les infos de la requête
      const {
        staff_first_name,
        staff_last_name,
        staff_email,
        staff_password,
        staff_phone,
        staff_role = 1,
        staff_isVerified = 0,
      } = req.body;
      // Verifier que tous les champs sont remplis
      if (
        !staff_first_name ||
        !staff_last_name ||
        !staff_email ||
        !staff_password ||
        !staff_phone
      ) {
        return res.status(400).render("connexion/accountCreation", {
          message: "Certains champs sont manquants",
        });
      }
      // validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(staff_email)) {
        return res.status(400).render("connexion/accountCreation", {
          message: "Adresse e-mail invalide",
        });
      }
      // validation du mot de passe
      if (staff_password.length < 8) {
        return res.status(400).render("connexion/accountCreation", {
          message: "Le mot de passe doit contenir au moins 8 caractères",
        });
      }
      // validation du numéro de telephone
      if (req.body.staff_phone.length < 10 || req.body.staff_phone.length > 10) {
        return res.status(400).render("connexion/accountCreation", {
          message: "Numéro de téléphone doit contenir 10 chiffres",
        });
      }
      // Verifier que l'email n'est pas deja utilisé
      const existingStaff = await staffModel.getOneByEmail(staff_email);
      if (existingStaff) {
        return res.status(400).render("connexion/accountCreation", {
          message: "Cet email est déjà utilisé",
        });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(staff_password, 10);
      // Generation du id de staff
      const staff_id = uuidv4();
      // Creation du nouveau staff
      const newStaff = {
        staff_id,
        staff_first_name,
        staff_last_name,
        staff_email,
        staff_password: hashedPassword,
        staff_phone,
        staff_isVerified,
        id_role: staff_role,
      };
      const result = await staffModel.create(newStaff);
      if (!result) {
        return res.status(500).render("connexion/accountCreation", {
          message: "Erreur lors de la création du compte",
        });
      }
      // Rediriger vers la page de connexion
      return res.redirect("/staff/login");
    }
  } catch (e) {
    console.error("Error during account creation:", e);
    return res.status(500).render("connexion/accountCreation", {
      message: "Erreur interne du serveur",
    });
  }
};

//Function de connexion
exports.login = async (req, res) => {
  try {
    if (req.method === "GET") {
      // Render la page de connexion
      res.render("connexion/login", { message: "" });
    } else if (req.method === "POST") {
      // Verifie que tous les champs sont remplis
      if (!req.body.staff_email || !req.body.staff_password) {
        return res.status(400).render("connexion/login", {
          message: "Certains champs sont manquants",
        });
      }

      // Recherche le staff dans la base de données
      const dataStaff = await staffModel.getOneByEmail(req.body.staff_email);

      // Verifie que le staff existe
      if (!dataStaff) {
        return res.status(401).render("connexion/login", {
          message: "veuillez créer un compte pour vous connecter!",
        });
      }
      // Compare le mot de passe entre la requête et la base de données
      const goodPassword = await bcrypt.compare(
        req.body.staff_password,
        dataStaff.staff_password
      );

      // Verifie que le mot de passe est bon
      if (!goodPassword) {
        return res.status(401).render("connexion/login", {
          message: "Email ou mot de passe incorrect !",
        });
      }

      if (dataStaff.staff_isVerified === 0) {
        return res.status(401).render("connexion/login", {
          message: "Veuillez attendre que votre compte soit verifié",
        });
      }

      const Staff = {
        staffEmail: dataStaff.staff_email,
       
      };

      const accessToken = jwt.sign(Staff, process.env.JWT_SECRET, {
        expiresIn: "1h",
        algorithm: "HS256",
      });

      // Creation du jeton d'accès
      const dateExperation = Date.now() + 3600000;
      res.cookie("TokenExpration", dateExperation, {
        httpOnly: true,
        maxAge: dateExperation,
      });

      // Creation du jeton
      res.cookie("Token", accessToken, {
        httpOnly: true,
        maxAge: dateExperation,
      });

      res.cookie("staff_email", dataStaff.staff_email, {
        httpOnly: true,
        maxAge: dateExperation,
      });

      // Redirection vers la page home
      return res.redirect("/server/servers");
    }
  } catch (e) {
    console.log("Error:", e);
    res.status(500).render("connexion/login", { message: "Erreur serveur." });
  }
};
//Function de deconnexion
exports.logout = async (req, res) => {
  res.clearCookie("TokenExpration");
  res.clearCookie("Token");
  res.clearCookie("staff_email");
  res.redirect("/staff/login");
};

exports.home = async (req, res) => {
  try {
    if (req.method === "GET") {
      res.render("404Error", {
        message: "vous etes connecté",
        staff: res.locals.staff,
      });
    }
  } catch (err) {
    console.log("e", err);
    res.render("404Error", {
      message: "impossible a charger la page",
      staff: {},
    });
  }
};

//Function de update staff
exports.account = async (req, res) => {
  try {
    const staff = await staffModel.getOneByEmail(req.cookies.staff_email);
    if (req.method === "GET") {
      return res.render("connexion/account", {
        staff: staff,
        error: null,
      });
    }
    if (req.method === "POST") {
      // validation du numéro de telephone
      if (req.body.staff_phone.length < 10 || req.body.staff_phone.length > 10) {
        return res.status(400).render("connexion/account", {
          staff: staff,
          error: "Numéro de téléphone doit contenir 10 chiffres",
        });
      }
      
      
      const hashedPassword = await bcrypt.hash(req.body.staff_password, 10);
      // Prepare the updated staff object
      const updatedStaffObject = {
        staff_id: staff.staff_id,
        staff_password: hashedPassword,
        staff_phone: req.body.staff_phone,
      };

      // Update the staff in the database
      const result = await staffModel.update(updatedStaffObject);
      if (!result) {
        return res.render("connexion/account", {
          staff: staff,
          error: "Impossible de mettre à jour le compte",
        });
      }
      // Redirect back to the account page after successful update
      return res.redirect("/server/servers");
    }
  } catch (err) {
    const staff = await staffModel.getOneByEmail(req.cookies.staff_email);
    console.log("e", err);
    res.render("connexion/account", {
      staff: staff,
      error: "impossible a charger la page",
    });
  }
};



