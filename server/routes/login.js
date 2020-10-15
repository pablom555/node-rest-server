const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./../models/user');

const app = express();

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    User.findOne({email}, (err, userDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !userDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'wrong (username) or password'
                }
            })
        }

        if( !bcrypt.compareSync(password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'wrong username or (password)'
                }
            })
        }

        let token = jwt.sign(
            { user: userDB },
            process.env.SEED,
            // Expira en 30 dias
            { expiresIn: process.env.EXPIRE_TOKEN}
        )

        res.json({
            ok: true,
            user: userDB,
            token
        })
    })

})

module.exports = app;