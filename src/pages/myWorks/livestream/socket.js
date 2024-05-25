import { io } from "socket.io-client";
// const socket = io('https://livestream-server-qhcr.onrender.com',{'multiplex':false,transports: ['websocket']})
const socket = io('http://localhost:4000',{'multiplex':false,transports: ['websocket']})
export default socket