const serverModel = require("../models/server.model");
const historyModel = require("../models/history.model");
const { clientModel } = require("../models/client.model");
const staffModel = require("../models/staff.model");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const CryptoJS = require("crypto-js");


// Function qui permet de compter les serveurs selon leur status en fonction des recherches ou non
function generateCount(statName, arrayCount) {
  if (arrayCount && arrayCount.length && arrayCount[0].nombre_serveurs !== undefined) {
    const matchingElement = arrayCount.find(
      (element) => element.ubybox_state_name === statName
    );
    return matchingElement ? matchingElement.nombre_serveurs : 0;
  } else {
    const matchingElement = arrayCount.filter(
      (element) => element.ubybox_state_name === statName
    );
    return matchingElement.length;
  }
}
//Function pour crypter et désencrypter la clé SSH et l'adresse IP
function encrypt(data, key) {
  const cipherText = CryptoJS.AES.encrypt(data, key).toString();
  return cipherText;
}
function decrypt(cipherText, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);

    if (bytes.sigBytes > 0) {
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    } else {
      throw new Error("Decryption Failed Invalid Key");
    }
  } catch (error) {
    throw new Error("Decryption Failed  Key");
  }
}

exports.serverList = async (req, res) => {
  try {
    const servers = await serverModel.getAllServer();
    const serverStats = await serverModel.getStateStats();
    let stats = {
      total: servers.length,
      onLine: generateCount("En ligne", serverStats),
      down: generateCount("En panne", serverStats),
      maintenance: generateCount("En maintenance", serverStats),
    };

    for (const server of servers) {
      server.contract = await serverModel.getContractOfServer(server.ubybox_serial_number) || null;
    }
    console.log("stats:", stats);
    res.render("server/server-list", { servers: servers, stats: stats });
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "impossible a charger server liste",
    });
  }
};

exports.searchServer = async (req, res) => {
  try {
    const query = req.query.query;
    const servers = await serverModel.searchServer(query);
    const serverStats = await serverModel.getStateStats();
    let stats = {
      total: servers.length,
      onLine: generateCount("En ligne", servers),
      down: generateCount("En panne", servers),
      maintenance: generateCount("En maintenance", servers),
    };
    for (const server of servers) {
      server.contract = await serverModel.getContractOfServer(server.ubybox_serial_number) || null;
    }
    console.log(servers);
    res.status(200).render("server/server-list", { servers, stats: stats, serverStats: serverStats });
  } catch (error) {
    res.status(500).render('404Error', { userName: 'erreur lors de la recherche des clients' });
  }
};


exports.serverForm = async (req, res) => {
  try {
    if (req.method === "GET") {
      const cpu = await serverModel.getAllCpu();
      const gpu = await serverModel.getAllGpu();

      res.render("server/server-add", { cpu, gpu });
    } else if (req.method === "POST") {
      const serial_num = uuidv4();
      const history_id = uuidv4();
      const sshKey = uuidv4();
      const addressIP = uuidv4();

      const newServer = {
        serialNumb: serial_num,
        addressIP: encrypt(addressIP, process.env.SECRET_KEY),
        sshKey: encrypt(sshKey, process.env.SECRET_KEY),
        infos: "",
        idState: 1,
      };

      const newHistory = {
        history_id,
        id_event_type: 1,
        history_date: new Date(),
        history_attachment: "",
        history_details: "creation du serveur",
        serial_number_ubybox: serial_num,
        id_staff: res.locals.staff.staff_id,
      };

      const newHardware = {
        ssd: JSON.stringify({
          frequence: req.body.ssd,
          size: req.body.ssdQuantity * 500,
        }),
        ram: JSON.stringify({
          type: req.body.ram,
          quantity: req.body.ramQuantity * 8,
        }),
        cpu: req.body.cpu,
        gpu: req.body.gpu,
        serialNumb: serial_num,
      };

      await serverModel.addOneServer(newServer);
      await historyModel.addOneHistory(newHistory);
      await serverModel.addHardware(newHardware);

      res.redirect("/server/servers");
    }
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "impossible a charger server liste",
    });
  }
};

exports.serverDetail = async (req, res) => {
  try {
    const server = await serverModel.getOneServer(req.params.id);

    server.ubybox_hardware_ssd = JSON.parse(server.ubybox_hardware_ssd);
    server.ubybox_hardware_ram = JSON.parse(server.ubybox_hardware_ram);

    server.contract = await serverModel.getContractOfServer(server.ubybox_serial_number) || null;

    res.render("server/server-detail", { server: server });
  } catch (e) {

    await serverModel.deleteOneHardwareBySerialNumber(req.params.id);
    await historyModel.deleteOneBySerialNumb(req.params.id);
    await serverModel.deleteOneServer(req.params.id);

    res.redirect("/server/servers");
  }
};

exports.serverUpdate = async (req, res) => {
  try {
    const server = await serverModel.getOneServer(req.params.id);
    const cpu = await serverModel.getAllCpu();
    const gpu = await serverModel.getAllGpu();
    const serverState = await serverModel.getAllStatus();

    if (req.method === "GET") {
      return res.render("server/server-update", {
        server: server,
        cpu,
        gpu,
        serverState,
      });
    } else if (req.method === "POST") {
      const updateServerHardware = {
        ssd: JSON.stringify({
          frequence: req.body.ssd,
          size: req.body.ssdQuantity * 500,
        }),
        ram: JSON.stringify({
          type: req.body.ram,
          quantity: req.body.ramQuantity * 8,
        }),
        cpu: req.body.cpu,
        gpu: req.body.gpu,
        serialNumb: req.params.id,
      };

      await serverModel.updateOneServerState(
        server.ubybox_serial_number,
        req.body.state
      );

      await serverModel.updateHardware(updateServerHardware);

      return res.redirect("/server/servers");
    }
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "impossible a charger server liste",
    });
  }
};

exports.serverDelete = async (req, res) => {
  try {
    await serverModel.deleteOneHardwareBySerialNumber(req.params.id);
    await historyModel.deleteOneBySerialNumb(req.params.id);
    await serverModel.deleteOneServer(req.params.id);

    res.redirect("/server/servers");
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "impossible a charger server liste",
    });
  }
};
// Cette fonction est un contrôleur d’Express.js qui tente de rendre une vue HTML (server/hardware).
// Si une erreur survient, elle capture l'erreur, l'affiche dans la console, et rend sur la page 404 error
exports.hardware = async (req, res) => {
  try {
    const hardware = await serverModel.getHardwareBySerialNum(req.params.id);

    res.render("server/hardware", {
      serverId: req.params.id,
      hardware: hardware[0],
      ram: JSON.parse(hardware[0].ubybox_hardware_ram),
      ssd: JSON.parse(hardware[0].ubybox_hardware_ssd),
    });
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "Impossible de charger la page du hardware",
    });
  }
};
// Cette fonction est un contrôleur d’Express.js qui tente de rendre une vue HTML (server/software).
// Si une erreur survient, elle capture l'erreur, l'affiche dans la console, et rend sur la page 404 error
exports.software = async (req, res) => {
  try {
    const applicationServer = await serverModel.getAllApplicationBySerialNumber(
      req.params.id
    );
    res.render("server/software", {
      applicationServer: applicationServer,
      serverId: req.params.id,
    });
  } catch (e) {
    console.log("e", e);
    res.render("404Eror", {
      message: "Impossible de charger la page du hardware",
    });
  }
};
// function pour afficher la page de confirmation du mot de passe(GET ET POST)
exports.confirmationMDP = async (req, res) => {
  try {
    const serverId = req.params.id;

    const server = await serverModel.getOneServer(serverId);

    if (req.method === "GET") {
      res.render("server/access-confirmationMDP", {
        serverId: serverId,
        message: null,
      });
    } else if (req.method === "POST") {
      const staffPassword = req.body.staff_password;
      const storedPassword = await staffModel.getPasswordByEmail(
        res.locals.staff.staff_email
      );
      // Compare the entered password with the stored hashed password
      const goodPassword = await bcrypt.compare(staffPassword, storedPassword);

      // If password is incorrect
      if (!goodPassword) {
        return res.status(401).render("server/access-confirmationMDP", {
          message: "Mot de passe incorrect!",
          serverId: serverId,
        });
      }

      if (!res.locals.staff.id_role === 1) {
        return res.render("server/access-confirmationMDP", {
          message: "vous n'avez pas les droits pour accéder à cette page",
        });
      }

      // Set a cookie to indicate that the user has verified their password
      res.cookie(`access_granted_${serverId}`, true, {
        httpOnly: true, // Cookie cannot be accessed via client-side JS for security
        maxAge: 15 * 60 * 1000, // Cookie expires in 15 minutes
      });

      //decrypt la clé ssh et l'addresse ip pour l'afficher
      server.ubybox_ssh_key = decrypt(
        server.ubybox_ssh_key,
        process.env.SECRET_KEY
      );
      server.ubybox_address_ip = decrypt(
        server.ubybox_address_ip,
        process.env.SECRET_KEY
      );
      return res.render("server/access-details", {
        server_id: serverId,
        server: server,
      });
    }
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "Impossible de charger la page du hardware",
    });
  }
};
// function pour afficher la page de access-details
exports.accessDetails = async (req, res) => {
  try {
    const serverId = req.params.id;
    //Verifié si le server existe
    const server = await serverModel.getOneServer(serverId);
    if (!server) {
      return res.render("404Error", {
        message: "Impossible de charger la page du hardware",
      });
    }

    // Effacer le cookie
    res.clearCookie(`access_granted_${serverId}`);

    res.render("server/access-details", {
      server_id: serverId,
      server: server,
    });
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "Impossible de charger la page du hardware",
    });
  }
};
// function pour afficher la page de mise à jour de la clé SSH(GET ET POST)
exports.sshUpdate = async (req, res) => {
  try {
    const serverId = req.params.id;

    //Verifié si le server existe
    const server = await serverModel.getOneServer(serverId);
    //si le server n'existe pas renvoie sur la page 404
    if (!server) {
      return res.render("home", {
        message: "Impossible de charger la page du hardware",
      });
    }
    //
    if (req.method === "GET") {
      server.ubybox_ssh_key = decrypt(
        server.ubybox_ssh_key,
        process.env.SECRET_KEY
      );
      res.render("server/ssh-key-update", {
        serverId: serverId,
        server: server,
        message: null,
      });
    } else if (req.method === "POST") {
      const updateSshClés = req.body.ssh_key;

      // Verifier si la clé SSH n'est pas vide
      if (!updateSshClés || updateSshClés.trim() === "") {
        server.ubybox_ssh_key = decrypt(
          server.ubybox_ssh_key,
          process.env.SECRET_KEY
        );
        return res.status(400).render("server/ssh-key-update", {
          serverId: serverId,
          server: server,
          message: "La clé SSH ne peut pas être vide",
        });
      }

      // Mettre à jour la clé SSH dans la base de données
      await serverModel.updateSShKey(
        server.ubybox_serial_number,
        encrypt(updateSshClés, process.env.SECRET_KEY)
      );
      // Effacer le cookie
      res.clearCookie(`access_granted_${serverId}`);
      // Redirecter vers la page de details.
      res.redirect(`/server/${serverId}/access-details`);
    }
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "Impossible de charger la page du hardware",
    });
  }
};
// function pour afficher la page de mise à jour de l'adresse IP(GET ET POST)
exports.addressIpUpdate = async (req, res) => {
  try {
    // recuperer l'id du serveur
    const serverId = req.params.id;

    // Verifier si le serveur existe
    const server = await serverModel.getOneServer(serverId);
    // si le serveur n'existe pas renvoie sur la page 404
    if (!server) {
      return res.render("home", {
        message: "Impossible de charger la page du hardware",
      });
    }

    if (req.method === "GET") {
      server.ubybox_address_ip = decrypt(
        server.ubybox_address_ip,
        process.env.SECRET_KEY
      );
      res.render("server/address-ip-update", {
        serverId: serverId,
        server: server,
        message: null,
      });
    } else if (req.method === "POST") {
      // recuperer l'adresse IP a mettre à jour dans la requête POST
      const updateIpAddress = req.body.ubybox_address_ip;

      // Verifier si l'IP n'est pas vide
      if (!updateIpAddress || updateIpAddress.trim() === "") {
        server.ubybox_address_ip = decrypt(
          server.ubybox_address_ip,
          process.env.SECRET_KEY
        );
        return res.status(400).render("server/address-ip-update", {
          serverId: serverId,
          server: server,
          message: "L'adresse IP ne peut pas être vide",
        });
      }

      // Mettre à jour l'adresse IP dans la base de données
      await serverModel.updateAddressIp(
        server.ubybox_serial_number,
        encrypt(updateIpAddress, process.env.SECRET_KEY)
      );
      // Effacer le cookie
      res.clearCookie(`access_granted_${serverId}`);
      // Redirecter vers la page de details.
      res.redirect(`/server/${serverId}/access-details`);
    }
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "Impossible de charger la page du hardware",
    });
  }
};

exports.serverFormClientToServer = async (req, res) => {
  try {
    //récupération des paramètres URL, id : identifiant, mode pour client ou server
    const { id, mode } = req.params;

    if (req.method === "GET") {
      //récupère tous les clients dans la BDD
      const clientsArray = await clientModel.getAllClient();
      const clientId = mode === "client" ? id : null;

      // Récupérer tous les serveurs
      const allServers = await serverModel.getAllServer();

      // Récupérer tous les contrats pour vérifier les serveurs associés et date NULL
      const allContracts = await serverModel.getAllContracts();

      // Filtrer les serveurs qui sont libres
      const availableServers = allServers.filter(server => {

        //si serveur lié a un contrat et que la date n'est pas null alors return 
        const isServerLinked = allContracts.some(
          contract => contract.serial_number_ubybox === server.ubybox_serial_number)
        return !isServerLinked;
      });

      res.render("server/server-add-client", {
        clientsArray,
        serverId: id,
        mode,
        clientId,
        servers: availableServers,  // Envoi des serveurs libres à la vue
      });
    } else if (req.method === "POST") {
      const contract_num = uuidv4();
      let newContract;

      if (mode === "server") {
        newContract = {
          contractNumber: contract_num,
          clause: req.body.clause,
          id_company: req.body.clientId,
          serial_number: id,
          contact_type: 1,
        };
      } else if (mode === "client") {
        newContract = {
          contractNumber: contract_num,
          clause: req.body.clause,
          id_company: id,
          serial_number: req.body.serverId,
          contact_type: 1,
        };
      }

      await serverModel.addContractFromServer(newContract);
      res.redirect("/server/servers");
    }
  } catch (e) {
    console.log("e", e);
    res.render("404Error", {
      message: "Impossible de charger la liste des serveurs",
    });
  }
};

