const express = require('express')
const cors = require('cors')
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
dotenv.config()

const secret = "SECRET1234"

const app = express()
const port = 3000

const getDb = require("./connection")

app.use(cors())
app.use(express.json())

let db;


function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] // Bearer 123
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: "Token is required." })
  }

  jwt.verify(token, secret, (err, username) => {
    if (err) {
      console.log(err);
      
      return res.status(403).json({ error: "Token is wrong." })
    }

    req.username = username
    next()
  })
}

function authAdminMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: "Token is required." })
  }

  jwt.verify(token, secret, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ error: "Token is wrong." })
    }

    if (data.role !== 'admin') {
      return res.status(403).json({ error: "Error happened!" })
    }

    next()
  })
}

app.get('/users', authMiddleware, async (req, res) => {
  const users = await db.collection("users").find().toArray()
  res.send(users)
})

app.get("/admin/users", authAdminMiddleware, async (req, res) => {
  const users = await db.collection("users").find().toArray()
  res.send(users)
})

app.post('/register', async (req, res) => {
    const { username, password, role } = req.body
    
    const users = await db.collection("users").find({ username: username }).toArray()

    if (users.length > 0) {
      return res.status(400).send({ error: "Username already exists." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    db.collection("users").insertOne({ username, password: hashedPassword, role })

    res.sendStatus(200)
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  const users = await db.collection("users").find({ username: username }).toArray()

  if (users.length > 1) {
    return res.status(400).send({ status: "Too many users." })
  }

  const user = users[0]

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  const token = jwt.sign({ username, role: user.role }, secret, { expiresIn: '1h' })

  if (isPasswordCorrect) {
    return res.status(200).send({ status: "Logged in", token: token })
  } else {
    return res.status(400).send({ status: "Wrong data." })
  }
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  db = await getDb()
  console.log('Connected to database.')
  console.log(process.env.TEST_ENV)
})