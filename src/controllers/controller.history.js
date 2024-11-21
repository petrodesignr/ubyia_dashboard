const historyModel = require("../models/history.model");
const { v4: uuidv4 } = require("uuid"); // Import UUID

// Ajoute une entrée de la table history
exports.historyAdd = async (req, res) => {
  try {
    if (req.method === "GET") {
      console.log(req.params.id);
      return res.render("history/historyAdd", { server_id: req.params.id });
    } else if (req.method === "POST") {  
      console.log("information", req.body.history_date);
      // Generate a new history_id using UUID
      const history_id = uuidv4();

      let date = req.body.history_date
      if (req.body.history_date_checkbox) {
        date = new Date();
      }
      // Prepare the history object with all fields
      const newHistory = {
        history_id,
        id_event_type: req.body.id_event_type,
        history_date: date,
        history_attachment: req.body.history_attachment,
        history_details: req.body.history_details,
        serial_number_ubybox: req.params.id,
        id_staff: 0,
      };

      // // Creer une nouvelle entrée dans la table history
      const result = await historyModel.addOneHistory(newHistory);
      if (!result) {
        return res.status(500).json({
          error: true,
          response: null,
          message: "Erreur lors de l'ajout de l'historique",
        });
      }
      return res.redirect("/server/" + req.params.id + "/history");
    }
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "Impossible de charger l'ajout d'historique",
    });
  }
};
// Modifie une entrée de la table history
exports.historyUpdate = async (req, res) => {
  try {
    if (req.method === "GET") {
      const history = await historyModel.getOneHistory(req.params.id_history);
      console.log(history);

      return res.render("history/historyUpdate", {
        history: history,
        server_id: req.params.id,
      });
    } else if (req.method === "POST") {
      const {
        id_event_type,
        history_date,
        history_attachment,
        history_details,
      } = req.body;
      console.log(req.params);
      // Verifier si history_id existe
      const existingHistory = await historyModel.getOneHistory(
        req.params.id_history
      );
      console.log(req.params);
      if (!existingHistory) {
        return res.status(404).json({
          error: true,
          response: null,
          message: "Historique non trouvé",
        });
      }

      // Prepare la modification de l'objet history
      const updatedHistory = {
        id_event_type: req.body.id_event_type,
        history_date: req.body.history_date,
        history_attachment: req.body.history_attachment,
        history_details: req.body.history_details,
      };

      // Modifie l'entrée de l'historique concernée dans la base de donnée
      await historyModel.updateOneHistory(req.params.id_history, updatedHistory);

      // Si la requete est bonne , redirection à la page souhaitée
      return res.status(200).redirect("/server/" + req.params.id + "/history");
    }
  } catch (e) {
    console.log("e", e);
    res.status(500).json({
      error: true,
      message: "Erreur lors de la mise à jour de l'historique",
    });
  }
};
// Supprime une entrée existante de la table history
exports.historyDelete = async (req, res) => {
  try {
    const idServer = req.params.id;
    const histories = await historyModel.getBySerialNumberUbybox(idServer);
    console.log("données", histories);
   
     if (req.method === "POST") {
      console.log("test",req.params.id_history)
      await historyModel.deleteOneHistory(req.params.id_history);
      
      res.redirect("/server/" + req.params.id + "/history");
    }
    
  } catch (e) {
    console.log("e", e);
    res.render("404Error", { message: e });
  }
};
// Cette fonction est un contrôleur d’Express.js qui tente de rendre une vue HTML (history/details/id).
// Si une erreur survient, elle capture l'erreur, l'affiche dans la console, et rend sur la page 404 error
exports.getHistorydetails = async (req, res) => {
  try {
    const idServer = req.params.id;
    const idHistory = req.params.id_history;
    const history = await historyModel.getOneHistory(idHistory);
    // récupere le staff en local dans le navigateur 
    const staff = res.locals.staff;
    console.log(history);
    return res.render("history/historyDetails", { history: history, server_id:idServer, staff:staff });
  } catch (error) {
    res.render("404Error", {
      message: "Impossible de charger la page du hardware",
    });
  }
};

// Cette fonction est un contrôleur d’Express.js qui tente de rendre une vue HTML (history/history).
// Si une erreur survient, elle capture l'erreur, l'affiche dans la console, et rend sur la page 404 error
exports.getHistory = async (req, res) => {
  try {
    const idServer = req.params.id;
    // Dans la table history il y aura des entrée dans lesquelle le serial number sera = a l'id donné
    const histories = await historyModel.getBySerialNumberUbybox(idServer);
    console.log("données", histories);
    // Si une entrée d'historique est reliée à l'id du server
    if (histories.length > -1) {
      // histories:histories fait référence aux données récupérées en bdd pour les appeler sur la vue
      return res.render("history/history", {
        histories: histories,
        server_id: req.params.id,
      });
    } else {
      res.render("404Error", {
        message: "Aucune entrée",
      });
    }
  } catch (error) {
    res.render("404Error", {
      message: "Impossible de charger la page du hardware",
    });
  }
};
