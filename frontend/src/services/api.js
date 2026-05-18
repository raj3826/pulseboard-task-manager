import axios from "axios";

const API = axios.create({
  baseURL: "https://pulseboard-task-manager-production.up.railway.app"
});

export default API;