const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

const User = require('./../models/user');
const Product = require('./../models/product');

// Habilitar subir imagenes
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function (req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No files were uploaded.'
                }
            });
    }

    // Valida si es para user o product
    let validTypes = ['users', 'products'];

    if (validTypes.indexOf(type) < 0) {

        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Invalid type, the allowed types are ' + validTypes.join(', ')
                }
            });
    }

    // Valida extensiones de archivos
    let file = req.files.file;

    let validFiles = ['png', 'jpg', 'gif', 'jpeg'];

    let fileNames = file.name.split('.');
    fileExtention = fileNames[fileNames.length - 1];

    if (validFiles.indexOf(fileExtention) < 0) {

        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Invalid Extension, the allowed extensions are ' + validFiles.join(', ')
                }
            })
    }

    // Cambiar Nombre al archivo
    let fileName = `${id}-${new Date().getMilliseconds()}.${fileExtention}`

    file.mv(`upload/${type}/${fileName}`, (err) => {

        if (err) {

            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (type === 'users') {
            imgUser(id, res, fileName);
        } else {
            imgProduct(id, res, fileName)
        }

    });
});


function imgProduct(id, res, fileName) {

    Product.findById(id, (err, productDB) => {

        if (err) {

            deleteImgAnt(fileName, 'products');

            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!productDB) {

            deleteImgAnt(fileName, 'products');

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                })
        }

        // Borra imagen antenior del usuario
        deleteImgAnt(productDB.img, 'products');

        // Cambia la imagen del usuario
        productDB.img = fileName;
        productDB.save((err, productDB) => {

            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
            }

            res.json({
                ok: true,
                product: productDB,
                img: fileName
            });

        })
    })
}


function imgUser(id, res, fileName) {

    User.findById(id, (err, userDB) => {

        if (err) {

            deleteImgAnt(fileName, 'users');

            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!userDB) {

            deleteImgAnt(fileName, 'users');

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'User not found'
                    }
                })
        }

        // Borra imagen antenior del usuario
        deleteImgAnt(userDB.img, 'users');

        // Cambia la imagen del usuario
        userDB.img = fileName;
        userDB.save((err, userDB) => {

            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
            }

            res.json({
                ok: true,
                user: userDB,
                img: fileName
            });

        })
    })
}

function deleteImgAnt(fileName, type) {

    let pathImgAnt = path.resolve(__dirname, `../../upload/${type}/${fileName}`);

    if (fs.existsSync(pathImgAnt)) {
        fs.unlinkSync(pathImgAnt)
    }
}

module.exports = app;