const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('./../models/user');

const { verifyToken, verifyAdminRole } = require('./../middlewares/authentication');

const app = express();

app.get('/user', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from)

    let limit = req.query.limit || 5;
    limit = Number(limit)

    let userActives = {state: true};

    // Con el segundo parametro indico que campos quiero mostrar
    User.find(userActives, 'name email role img google state')
        .skip(from)
        .limit(limit)
        .exec((err, usersDB) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            User.countDocuments( (userActives), (err, count) => {
               
                res.json({
                    ok: true,
                    user: usersDB,
                    count,
                    length: usersDB.length,
                })
            })

        })
})

app.post('/user', [verifyToken, verifyAdminRole], (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, userDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })

    });

});

app.put('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id

    // Con la funcion pick de underscode me quedo solo con las propiedades que quiero actualizar del objeto
    let body = _.pick(req.body, 'name', 'email', 'img', 'role', 'state');

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'User Not found'
                }
            })
        }

        res.json({
            ok: true,
            user: userDB
        })

    })

})

app.delete('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    
    let id = req.params.id;
    body = {state: false};

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'User Not found'
                }
            })
        }

        res.json({
            ok: true,
            user: userDB
        })

    })

})

module.exports = app;