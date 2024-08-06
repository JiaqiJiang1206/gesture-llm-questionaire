
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://teachernonverbal.asia/api'
    // baseURL: 'http://localhost:3000/api'
});

export default instance;