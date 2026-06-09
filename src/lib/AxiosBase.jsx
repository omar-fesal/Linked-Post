import axios from "axios";
const AxiosInstance = axios.create({
    baseURL: "https://route-posts.routemisr.com",
    timeout: 60_000, // 1 minute
    headers: {
        "Content-Type": "application/json",
    },
});

AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    config.headers = config.headers || {};

    if (token) {
        config.headers.token = token;
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

AxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem('token')
            if (window !== undefined) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);
export default AxiosInstance;
