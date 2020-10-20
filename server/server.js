
'use strict'

require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan')
const path = require('path');

const app = express();

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Habilitar carpeta public
app.use(express.static( path.resolve(__dirname, './../public')));

// Configuracion de rutas globales
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err, res) => {

    if (err) throw err;

    console.log('Base de datos online')

});

app.listen(process.env.PORT, () => {
  console.log(`Runing in ${process.env.PORT}`)
})