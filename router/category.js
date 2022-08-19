const express = require('express')
const router = express.Router()

let data = require('./../data/data.js')

router.post('/', (req, res) => {
    let body = req.body
    let db = data.readData()

    if (!body.title) {
        res.status(400).send("Title  is required!")
        return
    }
    if (!body.description) {
        res.status(400).send("Description  is required!")
        return
    }

    for (let i = 0; i < db.category.length; i++) {
        const element = db.category[i];
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} already exists!`);
            return
        }
    }

    body.created_at = new Date()
    db.category.push(body)
    data.writeData(db)
    res.status(201).send("successfully created!")

})
//read
router.get('/', (req, res) => {
    let db = data.readData()
    let search = req.query.search

    if (!search) {
        search = ""
    }

    let clist = db.category.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))


    if (clist.length == 0) {
        res.status(404).send("category not found!")
        return
    }

    res.json(clist)
})


router.get('/:id', (req, res) => {
    let db = data.readData()
    let category_id = parseInt(req.params.id)
    let category = db.category.find(e => e.id == category_id)
    if (!category) {
        res.status(400).send(`Category with ID:${category_id} does not exist!`);
        return
    }

    let ProductList = db.product.filter(e => e.category_id == category_id)
    if (!ProductList.length) {
        res.status(400).send(`Category ID:${category_id} doesn't have products`);
        return
    }

    res.json({ category: category, product:ProductList})
    
})

//update

router.put('/', (req, res) => {
    let db = data.readData()
    let body = req.body

    let category = db.category.find(e => e.id == body.id)

    if (!category) {
        res.status(400).send(`category id:${body.id} does not exist!`);
        return
    }

    for (let i = 0; i < db.category.length; i++) {
        const element = db.category[i];
        if (element.id == body.id) {
            body.created_at = db.category[i].created_at
            body.updated_at = new Date()
            db.category[i] = body
            break;
        }
    }

    data.writeData(db)
    res.status(200).send("successfully updated!")
})

//delete

router.delete('/:id', (req, res) => {
    let db = data.readData()
    let id = req.params.id

    let category = db.category.find(e => e.id == id)
    if (!category) {
        res.status(400).send(`category id:${id} does not exist!`);
        return
    }

    db.category = db.category.filter(e => e.id != id)
    data.writeData(db)

    res.status(200).send("successfully deleted!")
})

module.exports = { router }        