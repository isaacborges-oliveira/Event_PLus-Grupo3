import axios from "axios";

const apiPorta = "7118";

//endereço da api
const apiLocal = `https://localhost:${apiPorta}/api/`;

const api = axios.create({
    baseURL: apiLocal
});

export default api;