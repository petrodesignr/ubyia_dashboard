const sql = require("./database");

const Server = function () { };

Server.getAllServer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM ubybox LEFT JOIN ubybox_state ON ubybox_state.ubybox_state_id = ubybox.id_state `;


      sql.query(sqlRequest, [], (err, res) => {
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

Server.getOneServer = (serverId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM ubybox LEFT JOIN ubybox_state ON ubybox_state.ubybox_state_id = ubybox.id_state INNER JOIN ubybox_hardware ON ubybox_hardware.ubybox_serial_number = ubybox.ubybox_serial_number LEFT JOIN cpu ON ubybox_hardware.cpu_id = cpu.cpu_id LEFT JOIN gpu ON ubybox_hardware.gpu_id = gpu.gpu_id WHERE ubybox.ubybox_serial_number = ?;
`;

      sql.query(sqlRequest, [serverId], (err, res) => {
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

Server.addOneServer = (server) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `INSERT INTO ubybox(ubybox_serial_number, ubybox_address_ip, ubybox_ssh_key, ubybox_infos, id_state) 
            VALUES (?, ?, ?, ?, ?)`;

      sql.query(
        sqlRequest,
        [
          server.serialNumb,
          server.addressIP,
          server.sshKey,
          server.infos,
          server.idState,
        ],
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    } catch (e) {
      return reject(e);
    }
  });
};

Server.updateOneServerState = (serverId, state) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `UPDATE ubybox SET id_state=? WHERE ubybox_serial_number = ?`;

      sql.query(
        sqlRequest,
        [
          state,
          serverId,
        ],
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        }
      );
    } catch (e) {
      return reject(e);
    }
  });
};

Server.deleteOneServer = (serverId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `DELETE FROM ubybox WHERE ubybox_serial_number = ? `;

      sql.query(sqlRequest, [serverId], (err, res) => {
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

Server.deleteOneHardwareBySerialNumber = (serverId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `DELETE FROM ubybox_hardware WHERE ubybox_serial_number = ? `;

      sql.query(sqlRequest, [serverId], (err, res) => {
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

Server.updateAddressIp = (serverId, addressIp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `UPDATE ubybox SET ubybox_address_ip = ? WHERE ubybox_serial_number = ?`;
      sql.query(sqlRequest, [addressIp, serverId], (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    } catch (e) {
      return reject(e);
    }
  });
};

Server.updateSShKey = (serverId, sshKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `UPDATE ubybox SET ubybox_ssh_key = ? WHERE ubybox_serial_number = ?`;
      sql.query(sqlRequest, [sshKey, serverId], (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    } catch (e) {
      return reject(e);
    }
  });
}

Server.getAllApplicationBySerialNumber = (serverId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM ubybox_application LEFT JOIN application ON ubybox_application.id_application = application.application_id LEFT JOIN ubybox ON ubybox_application.serial_number_ubybox = ubybox.ubybox_serial_number WHERE ubybox_application.serial_number_ubybox = ?`;
      sql.query(sqlRequest, [serverId], (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    } catch (e) {
      return reject(e);
    }
  });
}

Server.getStateStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT ubybox_state.ubybox_state_name, COUNT(*) AS nombre_serveurs FROM ubybox INNER JOIN ubybox_state ON ubybox.id_state = ubybox_state.ubybox_state_id GROUP BY ubybox_state.ubybox_state_id;`;

      sql.query(sqlRequest, [], (err, res) => {
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

//permet de faire une recherche dans la page Server-list
Server.searchServer = (query) => {
  return new Promise((resolve, reject) => {
    const sqlRequest = 
    `SELECT 
        ubybox.*, 
        contract.*, 
        company.*, 
        ubybox_state.ubybox_state_name
        FROM ubybox
        INNER JOIN contract ON contract.serial_number_ubybox = ubybox.ubybox_serial_number
        LEFT JOIN company ON contract.id_company = company.company_id  -- Utilisation de LEFT JOIN pour garder les résultats même sans client
        INNER JOIN ubybox_state ON ubybox.id_state = ubybox_state.ubybox_state_id
        WHERE (ubybox.ubybox_serial_number LIKE ? OR company.company_id LIKE ?) AND contract.contract_date_dissociation IS NULL`;
         sql.query(sqlRequest,[`%${query}%`,`%${query}%`],(err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      }
    );
  });
};


Server.getAllStatus = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM ubybox_state`;

      sql.query(sqlRequest, [], (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      });
    } catch (e) {
      return reject(e);
    }
  });
}

Server.getAllGpu = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM gpu`;

      sql.query(sqlRequest, [], (err, res) => {
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

Server.getAllCpu = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM cpu`;

      sql.query(sqlRequest, [], (err, res) => {
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

Server.addHardware = (server) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `INSERT INTO ubybox_hardware(ubybox_hardware_ssd, ubybox_hardware_ram, cpu_id, gpu_id, ubybox_serial_number) 
            VALUES (?, ?, ?, ?, ?)`;

      sql.query(
        sqlRequest,
        [server.ssd, server.ram, server.cpu, server.gpu, server.serialNumb],
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    } catch (e) {
      return reject(e);
    }
  });
};

Server.getHardwareBySerialNum = (serverId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM ubybox_hardware LEFT JOIN cpu ON ubybox_hardware.cpu_id = cpu.cpu_id LEFT JOIN gpu ON ubybox_hardware.gpu_id = gpu.gpu_id  WHERE ubybox_serial_number=?`;

      sql.query(sqlRequest, [serverId], (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      });
    } catch (e) {
      return reject(e);
    }
  });
}

Server.updateHardware = (server) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `UPDATE ubybox_hardware SET ubybox_hardware_ssd=?,ubybox_hardware_ram=?,cpu_id=?,gpu_id=? WHERE ubybox_serial_number=? `;

      sql.query(
        sqlRequest,
        [
          server.ssd, server.ram, server.cpu, server.gpu, server.serialNumb
        ],
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        }
      );
    } catch (e) {
      return reject(e);
    }
  });
}

Server.addContractFromServer = (server) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `INSERT INTO contract(contract_number, contract_clause, id_company, serial_number_ubybox, contract_type) VALUES (?,?,?,?,?)`;

      sql.query(
        sqlRequest,
        [server.contractNumber, server.clause, server.id_company, server.serial_number, server.contact_type],
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    } catch (e) {
      return reject(e);
    }
  });
}

Server.getContractOfServer = (server) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlRequest = `SELECT * FROM contract WHERE serial_number_ubybox = ? AND contract_date_dissociation IS NULL`;

      sql.query(sqlRequest, [server], (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res[0]);
      });
    } catch (e) {
      return reject(e);
    }
  });
}

Server.getAllContracts = () => {
  return new Promise((resolve, reject) => {
    const sqlRequest = `SELECT * FROM contract WHERE contract_date_dissociation IS NULL`;

    sql.query(sqlRequest, (err,res) => {
      if(err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

module.exports = Server;
