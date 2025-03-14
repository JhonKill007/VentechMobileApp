import axios from "axios";

const Http = axios.create({
  baseURL: 'https://api.aycoro.com',
});

export default Http;

