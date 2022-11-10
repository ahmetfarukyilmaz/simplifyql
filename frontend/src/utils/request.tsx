import axios from 'axios'

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    // set auth token if it exists
    Authorization: localStorage.getItem('token'),
  },
})

export default request
