import axios from "axios";

export const instance = axios.create({
    // baseURL: "http://localhost:3333/",
    baseURL: "https://nodejsapi-amazonclone.onrender.com/",
    headers: {
        'Content-Type':'application/json'
    },
});
