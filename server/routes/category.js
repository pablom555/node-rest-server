const express = require('express');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const Category = require('../models/category');

const app = express();

/*
* Get all categories
*/
app.get('/category', verifyToken, (req, res) => {

    Category.find({})
        .sort('name')
        .populate('userCreation', 'name email')
        .exec((err, categoriesDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            categories: categoriesDB
        })
    })
    
})

/*
* Get category by Id
*/
app.get('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id

    Category.findById(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        
        if (!categoryDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category Not found'
                }
            })
        }

        return res.json({
            ok: true,
            category: categoryDB
        })
    })

})


/*
* Create a new category
*/
app.post('/category', verifyToken, (req, res) => {

    let body = req.body;

    let category = new Category({
        name: body.name,
        userCreation: req.user._id
    })

    category.save((err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })

    });
})

/*
* Update a category
*/
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id
    let category = req.body;

    Category.findByIdAndUpdate(id, category, { new: true, runValidators: true }, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category Not found'
                }
            })
        }

        res.json({
            ok: true,
            category: categoryDB            
        })

    })

})


/*
* Delete a category
*/
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category Not found'
                }
            })
        }

        res.json({
            ok: true,
            message: "Category Deleted"
        })

    })

})

module.exports = app;