import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Marks API endpoints
export const saveMarks = (marksData) => {
  return api.post("/performance/marks", { marks: marksData });
};

export const getMarks = () => {
  return api.get("/performance/marks");
};

export const predictPerformance = (grades) => {
  return api.post("/performance/predict", { grades });
};

export default api;