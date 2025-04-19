import axios from "axios";
import { BASE_URL, API_PATHS } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


//Request Interceptors
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response Interceptors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if(error.response){
            if(error.response.status === 401){
                window.location.href = "/login";
            }
            else if(error.response.status === 500){
                console.log("Internal Server Error");
        }
    }
    else if(error.code === "ECONNABORTED"){
        console.log("Connection Error");
    }
        
        return Promise.reject(error);
    }
);


export default axiosInstance;