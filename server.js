const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const port = process.env.PORT || 5001;
require("dotenv").config();
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const CryptoJs = require("crypto-js");

// ************** C O R S ****************
// Permet de définir les domaines autorisés à accéder à l'API
const cors = require("cors");
//app.use(cors());

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ajout des méthodes autorisées
  allowedHeaders: ["Content-Type", "Authorization", "otherData"], // Ajout des en-têtes autorisés
  optionsSuccessStatus: 200, // Pour les anciens navigateurs qui ne supportent pas le statut 204
  credentials: true, // Pour autoriser l'envoi de cookies et d'informations d'authentification
};

app.use(cors(corsOptions));

// ****************************************

//**** permettre de gérer PUT et DELETE des formulaires */
app.use(methodOverride('_method'));

// Middleware pour parser le JSON
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// Pour authoriser l'acces au dossier public
app.use(express.static(__dirname + "/src/public"));

//setting pour ejs et les vues
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.listen(5005);

// SUPPRIMER `0.0.0.0` POUR LE DEPLOYMENT
http.listen(3000 || process.env.PORT, () => {
  console.log(`Ecoute du port ${port}...`);
});

app.use(
  cookieSession({
    name: "session",
    keys: "sdfsdfsfsdf",
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
    httpOnly: true,
    secure: false, // Mettre à `true` pour les environnements de production avec HTTPS
    sameSite: "lax",
  })
);

const userRoute = require("./src/routes/route.user");
const serverRoute = require("./src/routes/route.server");
const staffRoute = require("./src/routes/route.staff");
const clientRoute = require("./src/routes/route.client");
const dashboardRoute = require("./src/routes/route.dashboard");

app.use("/user", userRoute);
app.use("/server", serverRoute);
app.use("/staff", staffRoute);
app.use("/client", clientRoute);
app.use("/tickets", dashboardRoute);

// 404
app.use((req, res, next) => {
  res.status(404).render("404Error", { message: "page 404" });
});
