const sql = require("./database");

const Staff = function () {};
// Function pour recuperer un staff par son email qui me sert pour le cookie
Staff.getOneByEmailCookies = (email) => {
  return new Promise((resolve, reject) => {
    const sqlRequest = `SELECT staff_id,staff_first_name, staff_last_name, staff_email, staff_phone,staff_isVerified, id_role FROM staff WHERE staff_email = ?`;
    sql.query(sqlRequest, [email], (err, res) => {
      if (err) {
        return resolve(null);
      }

      if (res.length === 0) {
        return resolve(null);
      }

      return resolve(res[0]);
    });
  });
};

// Function pour recuperer un staff par son email qui me sert pour le login
Staff.getOneByEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM staff WHERE staff_email = ?`;

      sql.query(sqlRequest, [email], (err, res) => {
        if (err) {
          return reject(err); 
        }

        if (res.length === 0) {
          return resolve(null); 
        }

        return resolve(res[0]); 
      });
    } catch (error) {
      reject(error); 
    }
  });
};


// Function pour créer un staff
Staff.create = (staff) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `
        INSERT INTO staff (staff_id, staff_first_name, staff_last_name, staff_email, staff_password, staff_phone,staff_isVerified, id_role)
        VALUES (?, ?, ?, ?, ?, ?, ?,?)
      `;

      // Execute the SQL query
      sql.query(
        query,
        [
          staff.staff_id,
          staff.staff_first_name,
          staff.staff_last_name,
          staff.staff_email,
          staff.staff_password, 
          staff.staff_phone,
          staff.staff_isVerified,
          staff.id_role,
        ],
        (error, result) => {
          if (error) {
            console.error("Error during staff creation:", error);
            return reject(error); 
          }

          console.log("Staff created successfully:", result.insertId);
          return resolve({
            id: result.insertId, 
            ...staff, 
          });
        }
      );
    } catch (e) {
      console.error("Caught an exception in Staff.create:", e);
      return reject(e); 
    }
  });
};

// Function pour mettre à jour un staff
Staff.update = (staff) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE staff
      SET  staff_password = ?, staff_phone = ?
      WHERE staff_id = ?
    `;

    sql.query(
      query,
      [
        staff.staff_password, 
        staff.staff_phone,
        staff.staff_id,
      ],
      (error, result) => {
        if (error) {
          console.error("Error during staff update:", error);
          return reject(error); 
        }

        if (result.affectedRows === 0) {
         
          return reject(new Error("Staff not found or no changes made."));
        }
        resolve({
          id: staff.staff_id,
          ...staff,
        });
      }
    );
  });
};

//function pour recuperer le password d'un staff par son email
Staff.getPasswordByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sqlRequest = `SELECT staff_password FROM staff WHERE staff_email = ?`;
    sql.query(sqlRequest, [email], (err, res) => {
      if (err) {
        return resolve(null);
      }

      if (res.length === 0) {
        return resolve(null);
      }

      return resolve(res[0].staff_password);
    });
  });
};




module.exports = Staff;
