const sql = require("mssql");
const configMaster = require("../database/config-master");
const configSlave = require("../database/config-slave");

const getProducts = (req, res) => {
    sql.connect(configSlave, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {

            var request = new sql.Request();
            request.query(`SELECT P.idProduct, P.nameProduct, P.stockProduct, P.imgProduct, P.priceProduct, C.nameCategory FROM Categories AS C LEFT JOIN Products as P ON (P.idCategory = C.idCategory) ORDER BY nameProduct`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(r.recordset);
                }
            });
        }
    });
} 

const getProduct= (req, res) => {
    sql.connect(configSlave, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {

            var request = new sql.Request();
            request.query(`SELECT P.idProduct, P.nameProduct, P.stockProduct, P.imgProduct, P.priceProduct, C.nameCategory FROM Categories AS C LEFT JOIN Products as P ON (P.idCategory = C.idCategory) WHERE P.idProduct = ${req.params.id}`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(r.recordset[0]);
                }
            });
        }
    });
} 


const deleteProduct = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {

            var request = new sql.Request();
            request.query(`DELETE FROM Products WHERE Products.idProduct = ${req.params.id}`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(r.recordset);
                }
            });
        }
    });
}

const addProduct = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            var request = new sql.Request();
            var data = req.body;
            request.query(`INSERT INTO Products (nameProduct, stockProduct, imgProduct, priceProduct, idCategory) VALUES ('${data.nameProduct}', ${data.stockProduct}, '${data.imgProduct}', ${data.priceProduct}, ${data.idCategory})`, (e, r) => {
                if (e) {
                    res.status(400).send(`Request error: ${e.message}`);
                } else {
                    res.status(200).send(r.recordset);
                }
            });
        }
    });
}

const updateProduct = (req, res) => {
    sql.connect(configMaster, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {
            var request = new sql.Request();
            var data = req.body;
            request.query(`UPDATE Products SET nameProduct = '${data.nameProduct}', stockProduct = ${data.stockProduct}, imgProduct = '${data.imgProduct}', priceProduct = ${data.priceProduct}, idCategory = ${data.idCategory} WHERE idProduct = ${data.idProduct}`, (e, r) => {
                if (e) {
                    res.status(400).send(`Request error: ${e.message}`);
                } else {
                    res.status(200).send(true);
                }
            });
        }
    });
}

const getCategories = (req, res) => {
    sql.connect(configSlave, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {

            var request = new sql.Request();
            request.query(`SELECT * FROM Categories ORDER BY nameCategory`, (e, r) => {
                if (e) {
                    res.status(400).send(e.message);
                } else {
                    res.status(200).send(r.recordset);
                }
            });
        }
    });
}

const getCategoryByName = (req, res) => {
    sql.connect(configSlave, (err) => {
        if (err) {
            res.status(400).send(err.message);

        } else {
            var request = new sql.Request();
            request.query(`SELECT * FROM Categories WHERE nameCategory = '${req.params.name}'`, (e, r) => {
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
    getProducts, 
    getProduct,
    deleteProduct, 
    addProduct, 
    updateProduct, 
    getCategories, 
    getCategoryByName
}