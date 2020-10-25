const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require( './../middlewares/authentication');

const app = express();

app.get('/images/:type/:img', verifyToken, (req, res) => {
   
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../upload/${type}/${img}`);

    console.log(fs.existsSync(pathImg))

    if (!fs.existsSync(pathImg)) {
        pathImg = path.resolve(__dirname, '../assets/no-image.jpg');
    } 

    res.sendFile(pathImg);

});

module.exports = app;

