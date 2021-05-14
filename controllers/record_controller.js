const sql = require("mssql");
const configMaster = require("../database/config-master");
const configSlave = require("../database/config-slave");

const getRecords = (req, res) => {
    sql.connect(configSlave, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {

            var request = new sql.Request();
            const idUser = req.params.id;
            request.query(`SELECT * FROM Records WHERE idUser = ${idUser}`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(r.recordset);
                }
            });
        }
    });
}

const addRecord = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {

            var request = new sql.Request();
            const data = req.body;
            request.query(`INSERT INTO Records (idUser, nameProduct, priceProduct, qtyProduct, dateRecord) VALUES (${data.idUser}, '${data.nameProduct}', ${data.priceProduct}, ${data.qtyProduct}, GETDATE())`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(true);
                }
            });
        }
    });
}

const beginTrans = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            var request = new sql.Request();
            request.query(`BEGIN TRAN`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(true);
                }
            });
        }
    });
}

const commitTrans = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            var request = new sql.Request();
            request.query(`COMMIT`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(true);
                }
            });
        }
    });
}

const rollbackTrans = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            var request = new sql.Request();
            request.query(`ROLLBACK`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(true);
                }
            });
        }
    });
}

module.exports = {
    addRecord,
    getRecords, 
    beginTrans, 
    commitTrans, 
    rollbackTrans
}