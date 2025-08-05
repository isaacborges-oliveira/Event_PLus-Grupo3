import axios from "axios";

const apiPorta = "7118";

//endereço da api
const apiLocal = `https://localhost:${apiPorta}/api/`;


const apiAzure = "https://apieventisaac-d8hyeec3fka2cpb9.brazilsouth-01.azurewebsites.net/api/"

const api = axios.create({
    baseURL: apiLocal
});

export default api;