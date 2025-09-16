import axios from "axios";

// Replace with your backend server URL
const API = axios.create({
  baseURL: "http://192.168.100.2:5000/api/auth", // For Android Emulator
  // baseURL: "http://localhost:5000/api/auth", // For iOS Simulator
  // baseURL: "http://<YOUR-IP>:5000/api/auth", // For real device
});

export default API;
