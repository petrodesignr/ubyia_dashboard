// Verifier si le staff est connecté
const isConnect = (req, res, next) => {
  //si le staff est connecté rediriger vers la page d'accueil
  if (req.cookies.Token) {
    return res.redirect("/server/servers");
  } else {
    return next();
  }
};

module.exports = isConnect;
