const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('./../models/user');

const app = express();

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    User.findOne({ email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'wrong (username) or password'
                }
            })
        }

        if (!bcrypt.compareSync(password, userDB.password)) {
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
            { expiresIn: process.env.EXPIRE_TOKEN }
        )

        return res.json({
            ok: true,
            user: userDB,
            token
        })
    })

})


// Config Google
async function verify(token, CLIENT_ID) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async (req, res) => {

    const idToken = req.body.idtoken;

    const googleUser = await verify(idToken, process.env.CLIENT_ID)
        .catch(e => {
            return res.status(403)
                .json({
                    ok: false,
                    err: e
                })
        })

    // Validate if googleUser exist in the DB
    User.findOne({ email: googleUser.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (userDB) {

            // if the user did not register with google, error user exist
            if (userDB.google === false) {
                
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'user registered by another method'
                    }
                })

            } else {

                // send token
                let token = jwt.sign(
                    { user: userDB },
                    process.env.SEED,
                    // Expira en 30 dias
                    { expiresIn: process.env.EXPIRE_TOKEN }
                )

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }

        } else {

            // if the user not exist, we create de new user
            let user = new User();
            user.name = googleUser.name
            user.email = googleUser.email
            user.img = googleUser.img
            user.google = true
            user.password = 'google' // This password never is used

            user.save((err, userDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign(
                    { user: userDB },
                    process.env.SEED,
                    // Expira en 30 dias
                    { expiresIn: process.env.EXPIRE_TOKEN }
                )

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })

            });
        }

    })


    // res.json({
    //     body: googleUser,
    // })
})

module.exports = app;