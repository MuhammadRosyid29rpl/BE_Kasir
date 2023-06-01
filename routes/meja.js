//import library
const express = require('express');
const bodyParser = require('body-parser');


//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

//import model
const model = require('../models/index');
const meja = require('../models/meja');
const Meja = model.meja

const auth = require('../auth')

const sequelize = require(`sequelize`);
const { mustLogin, mustBeAdmin, mustBeKasir, mustBeKasirOrAdmin } = require('../must');
const operator = sequelize.Op;

app.get("/", auth, mustLogin, mustBeKasirOrAdmin, async (req, res) => {
    const keyword = req.query.keyword || "";
    const result = await Meja.findAll();
    res.json({
        result: result,
    });
})
app.get("/bystatus", auth, mustLogin, mustBeKasirOrAdmin, async (req, res) => {
    const keyword = req.query.keyword || "";
    const result = await Meja.findAll({
        where: {
            [operator.or]: [{
                status: {
                    [operator.like]: keyword
                }
            }]
        },
    });
    res.json({
        result: result,
    });
})

//endpoint untuk menyimpan data meja, METHOD: POST, function: create
app.post("/", auth, mustLogin, mustBeAdmin, (req, res) => {
    let data = {
        nomor_meja: req.body.nomor_meja,
        status: req.body.status
    }

    Meja.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
app.put("/:id", auth, (req, res) => {
    let param = { id_meja: req.params.id }
    let data = {
        nomor_meja: req.body.nomor_meja
    }

    Meja.update(data, { where: param })
        .then(result => {
            res.json({
                message: "data has been changed"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.delete("/:id", auth, mustLogin, mustBeAdmin, (req, res) => {

    let param = { id_meja: req.params.id }
    Meja.destroy({ where: param })
        .then(result => {
            res.json({
                message: "data has been destroy"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })

})

app.get("/tersedia", auth, mustLogin, mustBeKasirOrAdmin, (req, res) => {
    Meja.findAll({ awhere: { status: "tersedia" } })
        .then(result => {
            res.json({
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

module.exports = app