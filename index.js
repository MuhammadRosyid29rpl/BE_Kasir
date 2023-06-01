//import
const express = require('express');
const cors = require('cors');
const path = require('path')

//implementasi
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/image/menu', express.static(path.join(__dirname, './image/menu')))
//endpoint nanti ditambahkan di sini
const User = require('./routes/user');
app.use("/user", User)
const Menu = require('./routes/menu');
app.use("/menu", Menu)
const Meja = require('./routes/meja');
app.use("/meja", Meja)
const Transaksi = require('./routes/transaksi');
app.use("/transaksi", Transaksi)
const Auth = require('./routes/auth');
app.use("/auth", Auth)
//run server
app.listen(8080, () => {
    console.log('server run on port 8080')
})
