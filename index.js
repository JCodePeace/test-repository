const express = require('express')
const cors = require('cors')
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
dotenv.config()

const app = express()
const port = 3000

const getDb = require("./connection")

app.use(cors())
app.use(express.json())

let db;


app.get('/users', async (req, res) => {
  const users = await db.collection("users").find().toArray()
  res.send(users)
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    
    const users = await db.collection("users").find({ username: username }).toArray()

    if (users.length > 0) {
      return res.status(400).send({ error: "Username already exists." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    db.collection("users").insertOne({ username, password: hashedPassword })

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

  if (isPasswordCorrect) {
    return res.status(200).send({ status: "Logged in" })
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