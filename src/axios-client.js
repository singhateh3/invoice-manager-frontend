import axios from "axios";

const AxiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
AxiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("🚀 Axios Request:", {
    url: config.url,
    method: config.method,
    params: config.params,
    data: config.data,
  });

  return config;
});

// Response interceptor
AxiosClient.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    const { response } = error;

    console.error("❌ Axios Error:", {
      url: error.config?.url,
      status: response?.status,
      data: response?.data,
      message: error.message,
    });

    // ❌ NO AUTO LOGOUT
    // ❌ NO TOKEN REMOVAL
    return Promise.reject(error);
  }
);

export default AxiosClient;
