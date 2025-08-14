import axios from 'axios';

// ✅ .env에서 우선 읽고, 없으면 안전 기본값으로
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || // e.g. '/api' (prod), 'http://localhost:8080/api' (dev)
  import.meta.env.VITE_API_BASE ||
  '/api';

const AI_BASE =
  import.meta.env.VITE_AI_API_URL ||   // e.g. '/ai' or 'http://localhost:5000/api'
  import.meta.env.VITE_AI_BASE ||
  '/ai';

// NOTE: refresh token은 쿠키에, access token은 로컬 스토리지에 저장
// TODO: access token이 만료되었을 때, 자동으로 refresh 요청하여 access token 갱신

export const instance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// NOTE: 요청 인터셉터가 로컬 스토리지에 저장된 access token을 가져와 헤더에 자동으로 추가
instance.interceptors.request.use(
  (config) => {
    // 🔒 '/auth/login'처럼 앞에 슬래시가 붙으면 baseURL의 '/api'가 무시되는 걸 방지
    if (typeof config.url === 'string' && config.url.startsWith('/')) {
      config.url = config.url.replace(/^\/+/, ''); // '/foo' -> 'foo'
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      // headers가 undefined일 수도 있으니 방어 코드
      config.headers = config.headers ?? {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const aiInstance = axios.create({
  baseURL: AI_BASE,
  withCredentials: true,
});