const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const SocketServer = require('./socketServer')
require('dotenv').config()

//routes
const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes')
const conversationRoutes = require('./routes/conversation.routes')

const app = express()
const HOST = process.env.HOST || 'http://localhost'
const PORT = process.env.PORT || 3001

//socket 
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: '*'
})

io.use((socket, next) => {
  const userID = socket.handshake.auth.userId;
  if (!userID) {
    return next(new Error("invalid userId"));
  }
  socket.userID = userID;
  socket.id = userID;
  next();
})

io.on('connection', socket => {
  SocketServer(socket)
})

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useCreateIndex: true,
  useUnifiedTopology: true, useFindAndModify: false
})


mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))


app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/posts/', postRoutes);
app.use('/', conversationRoutes);


http.listen(PORT, HOST, () => {
  console.log(`Server is running at ${HOST}:${PORT}`)
})