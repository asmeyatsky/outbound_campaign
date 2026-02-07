import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const getLeads = () => API.get('/leads');
export const startScrape = (city) => API.post('/scrape', { city });
export const getStatus = () => API.get('/status');

export default API;
