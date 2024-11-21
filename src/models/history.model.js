const sql = require("./database");
// Ici, un objet constructeur History est défini sous forme de fonction vide. Cet objet est utilisé comme un modèle. Bien qu'il soit vide, des méthodes statiques ou des propriétés peuvent être attachées à cet objet, comme on le voit avec addOneHistory
const History = function () {};
// addOneHistory est une méthode statique attachée à l'objet History. Cela signifie qu'elle n'a pas besoin d'une instance de History pour être appelée.
// Cette méthode prend un argument history =(history), qui est un objet contenant les informations à insérer dans la base de données. Les propriétés de cet objet correspondent aux colonnes de la table history dans la base de données.
History.addOneHistory = (history) => {
  // La méthode retourne une promesse. Une promesse est un objet qui représente la réussite ou l'échec d'une opération asynchrone.
  //   resolve est appelé si l'opération réussit.
  //   reject est appelé si l'opération échoue (ex : une erreur se produit).
  return new Promise(async (resolve, reject) => {
  // Le bloc try...catch est utilisé pour capturer des erreurs potentielles durant l'exécution de la requête SQL. Si une erreur se produit dans le bloc try, elle sera capturée dans catch, et la promesse sera rejetée avec l'erreur.
    try {
      // Requête SQL qui permet d'insérer une entrée dans la base de donnée sur la table "hisory" 
      const sqlRequest = ` INSERT INTO  history (history_id,id_event_type,history_date,history_attachment,history_details,serial_number_ubybox,id_staff)
                                VALUES (?,?,?,?,?,?,?) `;
      // sql.query est la méthode qui exécute la requête SQL sur la base de données. Elle prend 3 arguments :
      // sqlRequest : La requête SQL à exécuter (définie plus haut).
      // Un tableau de valeurs qui remplace les ? dans la requête SQL, c'est-à-dire les différentes propriétés de l'objet history.
      // Un callback qui est exécuté après l’exécution de la requête SQL.   
      sql.query(
        sqlRequest,
        [
          history.history_id,
          history.id_event_type,
          history.history_date,
          history.history_attachment,
          history.history_details,
          history.serial_number_ubybox,
          history.id_staff,
        ],
        (err, res) => {
          if (err) {
            console.error("erreur", err);
            return reject(err);
          }
          console.log("good");
          return resolve(true);
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
};
// Fonction pour récupérer l'information de la table history gràce au numéro de série de l'ubybox
History.getBySerialNumberUbybox = (serial_number_ubybox) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM history LEFT JOIN event_type ON history.id_event_type = event_type.event_type_id LEFT JOIN staff ON history.id_staff = staff.staff_id WHERE serial_number_ubybox = ?`;
      sql.query(sqlRequest, [serial_number_ubybox], (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    } catch (e) {
      return reject(e);
    }
  });
};
// Fonction pour récupérer l'information de la table history gràce  à l'id de l'hisotrique. Ici dans la requête SQL j'ai du aller récupérer les FK en joignant les tables correspondantes 
History.getOneHistory = (history_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM history LEFT JOIN event_type ON history.id_event_type = event_type.event_type_id LEFT JOIN staff ON history.id_staff = staff.staff_id WHERE history_id = ?  `;
      sql.query(sqlRequest, [history_id], (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res[0]);
      });
    } catch (e) {
      return reject(e);
    }
  });
};

// Fonction pour modifié l'information d'une entrée de la table history à partir de son id.
History.updateOneHistory = async (history_id, updatedHistory) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `UPDATE history SET history_date= ?,history_attachment=?,history_details=?,id_event_type= ? WHERE history_id = ? `;
      sql.query(
        sqlRequest,
        [
          updatedHistory.history_date,
          updatedHistory.history_attachment,
          updatedHistory.history_details,
          updatedHistory.id_event_type,
          history_id,
        ],
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res[0]);
        }
      );
    } catch (e) {
      return reject(e);
    }
  });
};
// Fonction pour supprimer une entrée de la table "hystory" à partir de son id.
History.deleteOneHistory= async(history_id)=>{
  return new Promise(async(resolve,reject)=>{
    try {
      const sqlRequest = `DELETE FROM history WHERE history_id = ?`
      sql.query(sqlRequest,[history_id],(err,res)=>{
        if (err){
          return reject(err)
        }
        return resolve(res)
      })
    } catch (error) {
      return reject(error)
    }
  })
}

History.deleteOneBySerialNumb = async (server_serial_nb) => {
  return new Promise(async(resolve,reject)=>{
    try {
      const sqlRequest = `DELETE FROM history WHERE serial_number_ubybox = ?`
      sql.query(sqlRequest,[server_serial_nb],(err,res)=>{
        if (err){
          return reject(err)
        }
        return resolve(res)
      })
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports = History;


// DEF  opération asynchrone : Une opération asynchrone permet de ne pas bloquer le programme principal pendant que des tâches longues ou imprévisibles (comme les appels réseau, la lecture de fichiers, ou l'accès à une base de données) s'exécutent.Le programme continue à fonctionner normalement, et lorsqu'une opération asynchrone se termine, un callback, une promesse ou async/await permet de gérer le résultat ou l'erreur.
