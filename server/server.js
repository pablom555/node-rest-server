
'use strict'

require('./config/config');

const express = require('express');
const morgan = require('morgan')

const app = express();

app.use(morgan('dev'))
app.use(express.json())

app.get('/usuario', (req, res) => {
  res.json("get usuario");
})

app.post('/usuario', (req, res) => {
  res.json("post usuario");
})

app.put('/usuario/:id', (req, res) => {

  let id = req.params.id
  res.json("put usuario " + id);
})

app.delete('/usuario', (req, res) => {
  res.json("delete usuario");
})


app.listen(process.env.PORT, () => {
  console.log(`Runing in ${process.env.PORT}`)
})