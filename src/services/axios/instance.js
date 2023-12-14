import axios from "axios";

export const instance = axios.create({
    // baseURL: "http://localhost:3333/",
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type':'application/json'
    },
});
