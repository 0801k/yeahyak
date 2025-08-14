import axios from 'axios';

// NOTE: refresh token은 쿠키에, access token은 로컬 스토리지에 저장
// TODO: access token이 만료되었을 때, 자동으로 refresh 요청하여 access token 갱신

export const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// NOTE: 요청 인터셉터가 로컬 스토리지에 저장된 access token을 가져와 헤더에 자동으로 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

export const aiInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});
