const express = require("express");
const router = express.Router();
const serverController = require("../controllers/controller.server");
const sessionauth = require("../middlewares/middleware.session");
const historyController = require("../controllers/controller.history");
const accessGranted = require("../middlewares/midlleware.isGarnted");


router.get("/servers", sessionauth, serverController.serverList);
//permet de faire une recherche
router.get('/search',  sessionauth, serverController.searchServer);

router.get("/add", sessionauth, serverController.serverForm);
router.post("/add", sessionauth, serverController.serverForm);
router.get("/update/:id", sessionauth, serverController.serverUpdate);
router.post("/update/:id", sessionauth, serverController.serverUpdate);
router.get("/detail/:id", sessionauth, serverController.serverDetail);
router.get("/:id/hardware", sessionauth, serverController.hardware);
router.get("/:id/software", sessionauth, serverController.software);
router.post("/delete/:id", sessionauth, serverController.serverDelete);

router.get("/:id/history", sessionauth, historyController.getHistory);
router.get("/:id/history/add", sessionauth, historyController.historyAdd);
router.post("/:id/history/add", sessionauth, historyController.historyAdd);

router.get("/:id/history/update/:id_history",sessionauth,historyController.historyUpdate);
router.post("/:id/history/update/:id_history",sessionauth,historyController.historyUpdate);

router.get("/:id/history/delete/:id_history",sessionauth,historyController.historyDelete);
router.post("/:id/history/delete/:id_history",sessionauth,historyController.historyDelete);

router.get("/:id/history/details/:id_history",sessionauth,historyController.getHistorydetails);

router.get("/:id/access-confirmationMDP",sessionauth,serverController.confirmationMDP);

router.post("/:id/access-confirmationMDP",sessionauth,serverController.confirmationMDP);

 router.get("/:id/access-details",sessionauth,accessGranted,serverController.accessDetails);

router.get("/:id/access-details/ssh-key-update", sessionauth,accessGranted, serverController.sshUpdate);

router.post("/:id/access-details/ssh-key-update",sessionauth,accessGranted,serverController.sshUpdate);

router.get("/:id/access-details/address-ip-update",sessionauth,accessGranted,serverController.addressIpUpdate);

router.post("/:id/access-details/address-ip-update",sessionauth,accessGranted,serverController.addressIpUpdate);

router.get("/addClient/:id/:mode", sessionauth, serverController.serverFormClientToServer);
router.post("/addClient/:id/:mode", sessionauth, serverController.serverFormClientToServer);
module.exports = router;
