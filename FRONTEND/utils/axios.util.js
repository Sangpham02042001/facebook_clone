import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001'
})

const baseURL = 'http://localhost:3001'

export { axiosInstance, baseURL }