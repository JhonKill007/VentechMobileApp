import axios from "axios";

const Http = axios.create({
  baseURL: "https://api.ventech.countechrd.com",
});

// Http.defaults.headers["Authorization"] = `Bearer ${tuTokenAqui}`;

export default Http;
