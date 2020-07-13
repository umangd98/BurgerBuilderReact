import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-c6d31.firebaseio.com/',
});

export default instance;
