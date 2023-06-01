//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyengankan"



//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


require("dotenv").config();


//import model
const model = require('../models/index');
const user = model.user
//endpoint menampilkan semua data user, method: GET, function: findAll()
app.post("/login", async (req, res) => {
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




module.exports = app