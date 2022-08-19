const express = require('express')
const app = express()
const PORT = 3000
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is running')
})

const categoryRouter = require('./router/category')
const productRouter = require('./router/product')

app.use('/category', categoryRouter.router)
app.use('/product', productRouter.router)

app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`)
})
