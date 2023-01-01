import axios from "axios";

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // get the auth token from the local storage if it exists

  headers: {
    Authorization: localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "",
  },
});

export default request;
