import axios from "axios";

const client = axios.create();

// TODO: 배포 후 백엔드 서버 주소로 변경해야 합니다.
client.defaults.baseURL = "http://localhost:3001";

export default client;