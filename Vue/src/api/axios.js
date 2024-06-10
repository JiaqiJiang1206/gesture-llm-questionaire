
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://teachernonverbal.asia/api',
    timeout: 1000,
});

export default instance;