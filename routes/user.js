//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyengankan"
const { mustLogin, mustBeAdmin } = require("../must")

//import model
const model = require('../models/index');
const user = model.user
//endpoint menampilkan semua data user, method: GET, function: findAll()
app.get("/", (req, res) => {
    user.findAll()
        .then(result => {
            res.json({
                user: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/:id", (req, res) => {
    let param = { id_user: req.params.id }
    user.findOne({ where: param })
        .then(result => {
            res.json({
                user: result
            })
        })
        .catch(err => {
            res.json({
                msg: err.message
            })
        })

})

app.post("/auth", auth, mustLogin, mustBeAdmin, async (req, res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    let result = await user.findOne({ where: data })
    if (result) {
        let payload = JSON.stringify(result)
        // generate token
        let token = jwt.sign(payload, SECRET_KEY)
        res.json({
            logged: true,
            data: result,
            token: token
        })
    } else {
        res.json({
            logged: false,
            message: "Invalid username or password"
        })
    }
})


//endpoint untuk menyimpan data user, METHOD: POST, function: create
app.post("/", auth, mustLogin, mustBeAdmin, (req, res) => {
    let data = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password)
    }

    user.create(data)
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

app.put("/:id", auth, mustLogin, mustBeAdmin, (req, res) => {
    let param = { id_user: req.params.id }
    let data = {
        nama_user: req.body.nama_user,
        role: req.body.role,
        username: req.body.username,
        password: md5(req.body.password)
    }

    user.update(data, { where: param })
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

    let param = { id_user: req.params.id }
    user.destroy({ where: param })
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
module.exports = app