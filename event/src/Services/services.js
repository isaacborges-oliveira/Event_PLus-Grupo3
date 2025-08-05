import axios from "axios";


const apiPorta = "5289"
const apilocal = `http://localhost:${apiPorta}/api/`;

const apiAzure ="https://apieventisaac-d8hyeec3fka2cpb9.brazilsouth-01.azurewebsites.net/api/";


const api = axios.create({  
baseURL : apiAzure
});

export default api;