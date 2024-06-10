
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://teachernonverbal.asia/api'
});

export default instance;