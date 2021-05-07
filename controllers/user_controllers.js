const sql = require("mssql");
const configMaster = require("../database/config-master");
const configSlave = require("../database/config-slave");

const getUsers = (req, res) => {
    sql.connect(configSlave, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {

            var request = new sql.Request();
            request.query(`SELECT U.idUser, U.nameUser, U.passUser, U.imgUser, T.nameUserType FROM Users AS U LEFT JOIN UserTypes as T ON (U.idUserType = T.idUserType) ORDER BY nameUser`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(r.recordset);
                }
            });
        }
    });
} 

const getUser= (req, res) => {
    sql.connect(configSlave, (err) => {
        if (err) {
            res.status(400).send(false);

        } else {

            var request = new sql.Request();
            request.query(`SELECT U.idUser, U.nameUser, U.passUser, U.imgUser, T.nameUserType FROM Users AS U LEFT JOIN UserTypes as T ON (U.idUserType = T.idUserType) WHERE U.idUser = ${req.params.id}`, (e, r) => {
                if (e) {
                    res.status(400).send(false);
                } else {
                    res.status(200).send(r.recordset[0]);
                }
            });
        }
    });
} 

const getStorers = (req, res) => {
    sql.connect(configSlave, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {
            const STORER_ID = 2;
            var request = new sql.Request();
            request.query(`SELECT U.idUser, U.nameUser, U.passUser, U.imgUser, T.nameUserType FROM Users AS U LEFT JOIN UserTypes as T ON (U.idUserType = T.idUserType) WHERE T.idUserType = ${STORER_ID} ORDER BY nameUser`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(r.recordset);
                }
            });
        }
    });
}

const deleteUser = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {

            var request = new sql.Request();
            request.query(`DELETE FROM Users WHERE Users.idUser = ${req.params.id}`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(r.recordset);
                }
            });
        }
    });
}

const addUser = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {
            var request = new sql.Request();
            var data = req.body;
            request.query(`INSERT INTO Users (nameUser, passUser, idUserType, imgUser) VALUES ('${data.nameUser}', '${data.passUser}', ${data.idUserType}, '${data.imgUser}')`, (e, r) => {
                if (e) {
                    res.status(400).send(`Request error: ${e.message}`);
                } else {
                    res.status(200).send(true);
                }
            });
        }
    });
}

const updateUser = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send({ status: false, message: `${err.message}` });

        } else {
            var request = new sql.Request();
            var data = req.body;
            console.log(data);
            request.query(`UPDATE Users SET nameUser = '${data.nameUser}', passUser = '${data.passUser}', idUserType = ${data.idUserType}, imgUser = '${data.imgUser}' WHERE Users.idUser = ${data.idUser}`, (e, r) => {
                if (e) {
                    res.status(400).send({ status: false, message: `${e.message}` });
                } else {
                    res.status(200).send({ status: true });
                }
            });
        }
    });
}

const getUserByName = (req, res) => {
    sql.connect(configSlave, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {
            var request = new sql.Request();
            request.query(`SELECT * FROM Users WHERE Users.nameUser = '${req.params.name}'`, (e, r) => {
                if (e) {
                    res.status(400).send(`Request error: ${e.message}`);
                } else {
                    if (r.recordset.length === 0) {
                        res.status(200).send({});    
                    } else {
                        res.status(200).send(r.recordset[0]);
                    }
                }
            });
        }
    });
}

module.exports = {
    getUsers,
    getUser,
    getStorers,
    deleteUser, 
    addUser, 
    updateUser, 
    getUserByName
}