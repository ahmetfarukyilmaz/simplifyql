import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    // set auth token if it exists
    Authorization: localStorage.getItem('token'),
  },
})

export default request
