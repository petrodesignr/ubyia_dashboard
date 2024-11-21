const staffModel = require("../models/staff.model");

// Middleware pour la session
const sessionAuth = async (req, res, next) => {
  // Verifier si le jeton existe
  if (req.cookies.Token) {
    // Verifier si le jeton n'est pas expire
    if (req.cookies.TokenExpration < Date.now()) {
      res.clearCookie("TokenExpration");
        res.clearCookie("Token");
        res.clearCookie("staff_email");
      // Rediriger vers la page de connexion si le jeton est expire
      return res.redirect("/staff/login");
    }
    // recuperer un staff depuis le cookie
    const staffCookies = await staffModel.getOneByEmailCookies(
      req.cookies.staff_email
    );
    // Verifier si le staff est verifie
    if (staffCookies.staff_isVerified == 0) {
        res.clearCookie("TokenExpration");
        res.clearCookie("Token");
        res.clearCookie("staff_email");
       return res.redirect("/staff/login");
    }
    //creer un objet staff
    const staff = {
      staff_id: staffCookies.staff_id,
      staff_email: staffCookies.staff_email,
      staff_first_name: staffCookies.staff_first_name,
      staff_last_name: staffCookies.staff_last_name,
      staff_isVerified: staffCookies.staff_isVerified,
      id_role: staffCookies.id_role,
    };
    // Ajouter le staff au locals de la requête
    res.locals.staff = staff;
    return next();
  } else {
    // Rediriger vers la page de connexion
    return res.redirect("/staff/login");
  }
};

module.exports = sessionAuth;