// import axios from "axios";

// const Http = axios.create({
//   baseURL: "https://api.ventech.countechrd.com",
// });

// // Http.defaults.headers["Authorization"] = `Bearer ${tuTokenAqui}`;

// export default Http;

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://api.farmaciamanzueta.online";

const Http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const excludedRoutes = ["/auth/login", "/auth/register"];
// Interceptor para agregar el token de autenticación
Http.interceptors.request.use(
  async (config) => {

    if (excludedRoutes.some(route => config.url?.includes(route))) {
      return config;
    }
    const token = await AsyncStorage.getItem("TK");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
Http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Token expirado, redirigir a login...");
      await AsyncStorage.removeItem("token");
      // Aquí puedes navegar a la pantalla de login
    }
    return Promise.reject(error);
  }
);

export default Http;

