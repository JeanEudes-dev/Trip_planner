import axios from "axios";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: "https://spotter-trip-planner.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication headers here if needed
    // For example: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // You can handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error("Server error occurred");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
