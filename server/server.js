
'use strict'

require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan')

const app = express();

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require('./routes/users'));

mongoose.connect(process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err, res) => {

    if (err) throw err;

    console.log('Base de datos online')

});

app.listen(process.env.PORT, () => {
  console.log(`Runing in ${process.env.PORT}`)
})