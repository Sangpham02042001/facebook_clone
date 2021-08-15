const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

//routes
const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes')

const app = express()
const HOST = process.env.HOST || 'http://localhost'
const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))


app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/posts/', postRoutes);


app.listen(PORT, HOST, () => {
  console.log(`Server is running at ${HOST}:${PORT}`)
})