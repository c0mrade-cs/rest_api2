const express = require('express')
const router = express.Router()

let data = require('./../data/data.js')

//create
router.post('/', (req, res) => {
    let db = data.readData()
    let body = req.body

    if (!body.category_id) {
        res.status(400).send("Category ID is required!")
        return
    }
    if (!body.title) {
        res.status(400).send("Title  is required!")
        return
    }
    if (!body.description) {
        res.status(400).send("Description  is required!")
        return
    }
    if (!body.photo) {
        res.status(400).send("Photo  is required!")
        return
    }

    for (let i = 0; i < db.product.length; i++) {
        const element = db.product[i];
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} does not exists!`);
            return
        }
    }

    body.created_at = new Date()
    db.product.push(body)
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

    let plist = db.product.filter(e => e.title&&e.description.toLowerCase().includes(search.toLowerCase()))

    if (plist.length == 0) {
        res.status(404).send("products not found!")    
        return
    }

    res.json(plist)
})

router.get('/:id', (req, res) => {
    let db = data.readData()
    let id = req.params.id

    let product = db.product.find(e => e.id == id)
    if (!product) {
        res.status(400).send(`product id:${id} not found!`);
        return
    }

    res.status(200).json(product)

   
})

//update
router.put('/', (req, res) => {
    let db = data.readData()
    let body = req.body
    let product = db.product.find(e => e.id == body.id)

    if (!product) {
        res.status(400).send(`product id:${body.id} does not exist!`);
        return
    }

    for (let i = 0; i < db.product.length; i++) {
        const element = db.product[i];
        if (element.id == body.id) {
            body.created_at = db.product[i].created_at
            body.updated_at = new Date()
            db.product[i] = body
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
    let product = db.product.find(e => e.id == id)
    if (!product) {
        res.status(400).send(`product id:${id} does not exist!`);
        return
    }

    db.product = db.product.filter(e => e.id != id)
    data.writeData(db)
    res.status(200).send("successfully deleted!")
})

module.exports = { router }