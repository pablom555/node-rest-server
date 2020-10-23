const express = require('express');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const _ = require('underscore');

const Product = require('../models/product');

const app = express();

/*
* Get all products
*/
app.get('/product', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from)

    let limit = req.query.limit || 5;
    limit = Number(limit)

    Product.find({})
        .skip(from)
        .limit(limit)
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productsDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                products: productsDB
            })
        })

})

/*
* Get product by Id
*/
app.get('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Product Not found'
                    }
                })
            }

            return res.json({
                ok: true,
                product: productDB
            })
        })

})

/*
* Get product by name
*/
app.get('/product/search/:name', verifyToken, (req, res) => {

    let name = req.params.name;

    let regexName = new RegExp(name, 'i');

    Product.find({ name: regexName})
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productsDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productsDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Product Not found'
                    }
                })
            }

            return res.json({
                ok: true,
                product: productsDB
            })
        })

})


/*
* Create a new product
*/
app.post('/product', verifyToken, (req, res) => {

    let body = req.body;

    let product = new Product({
        name: body.name,
        priceUni: body.priceUni,
        description: body.description,
        category: body.category,
        user: req.user._id
    })

    product.save((err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            product: productDB
        })

    });
})

/*
* Update a product
*/
app.put('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id

    // Con la funcion pick de underscode me quedo solo con las propiedades que quiero actualizar del objeto
    let product = _.pick(req.body, 'name', 'priceUni', 'description', 'category');
    product = { ...product, available: true }

    Product.findByIdAndUpdate(id, product, { new: true, runValidators: true }, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Product Not found'
                }
            })
        }

        res.json({
            ok: true,
            product: productDB
        })

    })

})


/*
* Delete a product
*/
app.delete('/product/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;
    body = { available: false };

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Product Not found'
                }
            })
        }

        res.json({
            ok: true,
            product: productDB
        })

    })

})

module.exports = app;