import { io } from 'socket.io-client'
import { baseURL } from './utils'

const socket = io(baseURL, {
  autoConnect: false
})

export default socket;