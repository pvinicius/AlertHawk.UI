import axios from "axios";
import axiosRetry from "axios-retry";
import { resetStore } from "../store";
import logging from "../utils/logging";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_AUTH_API_URL,
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    logging.info(`retry attempt: ${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    if (
      error.response?.status === 400 ||
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error.response?.status === 404 ||
      error.response?.status === 500
    ) {
      // Do not retry on 400, 401, 403, 404 or 500
      return false;
    }

    return true;
  },
});

function surfaceLogout() {
  sessionStorage.clear();
  setTimeout(() => {
    window.location.href = "/";
    resetStore();
  }, 10);
}

axiosInstance.interceptors.request.use(async (requestConfig) => {
  const jwtToken = sessionStorage.getItem("jwtToken");

  if (jwtToken != null) {
    requestConfig.headers["Authorization"] = `Bearer ${jwtToken}`;
  } else {
    surfaceLogout();
  }

  return requestConfig;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      error.response?.status === 403 ||
      // error.response?.status === 500 ||
      error.code == "ERR_NETWORK"
    ) {
      surfaceLogout();
    }

    throw error;
  }
);

export default axiosInstance;
