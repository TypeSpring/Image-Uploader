import axios, { AxiosInstance } from "axios";

export const request: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_URL}/api/v1`, // 기본 서버 주소 입력
});
