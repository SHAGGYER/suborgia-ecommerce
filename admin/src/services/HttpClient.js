import axios from "axios";
import cogoToast from "cogo-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (error?.response?.data?.message) {
      cogoToast.error(error?.response?.data?.message);
    }

    return Promise.reject(error);
  }
);
const HttpClient = () => {
  const token = localStorage.getItem("token");

  const defaultSettings = {
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  };

  return {
    get: (url, options = {}) =>
      axios.get(url, { ...defaultSettings, ...options }),
    post: (url, data, options = {}) =>
      axios.post(url, data, { ...defaultSettings, ...options }),
    put: (url, data, options = {}) =>
      axios.put(url, data, { ...defaultSettings, ...options }),
    delete: (url, options = {}) =>
      axios.delete(url, { ...defaultSettings, ...options }),
  };
};

export default HttpClient;
