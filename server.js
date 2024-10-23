const express = require('express')
const bodyParser = require('body-parser') //middlewere convert json body
const mysql = require('mysql2') //middlewere to conect mysql db
const app = express()
const port = 3000

app.use(bodyParser.json()) //use middlewere convert json body

//create db connection
const db = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '12345678',
  database: 'mydb'
})

//connect to db
db.connect((err) => {
  if (err) {
    throw err
  }
  console.log('connect to database')
})

//POST create product
app.post('/products', (req, res) => {
  const { name, price, discount, review_count,image_url } = req.body
  const sql = "INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)"
  db.query(sql, [name, price, discount, review_count,image_url], (err, results) => {
    if (err) {
      res.status(500).json({
        message: 'Internal server error.',
        error: err 
      })      
    } else {
      res.status(201).json({
        message: 'Products added successfully.'
      })
    }
  })
})

//GET all products
app.get('/products', (req, res) => {
  const sql = "SELECT * FROM products;"
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Internal server error', error: err })
      //agument 1 คือ massage จาก Dev , agument 2 คือ error ของระบบ
    } else {
      res.status(200).json(results)
    }
  })  
})

//GET product by id
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const sql = "SELECT * FROM products WHERE id = ?"
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' })
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    } else {
      res.status(201).json({
        message: 'Products added successfully.',
        product: results[0]
      })
    }            
  })
})

//PUT edit product by id
app.put('/products/:id', (req, res) => {
  const { name, price, discount, review_count,image_url } = req.body
  const id = parseInt(req.params.id)
  const sql = "UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?"
  db.query(sql, [name, price, discount, review_count,image_url, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' })
    } else if (result.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    } else {
      res.status(200).json({
        message: 'Products updated successfully.'
      })
    }            
  })
})

//DELETE product by id
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const sql = "DELETE FROM products WHERE id = ?"
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' })
    } else if (result.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    } else {
      res.status(200).json({
        message: 'Products deleted successfully.'
      })
    }            
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})