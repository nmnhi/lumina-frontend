import axios from "axios";

// 🌟 KHỞI TẠO INSTANCE AXIOS VỚI ĐƯỜNG DẪN GỐC TỚI BACKEND
const api = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  timeout: 10000, // Ngắt kết nối nếu server không phản hồi sau 10 giây
  headers: {
    "Content-Type": "application/json"
  }
});

// 🌟 INTERCEPTOR CHO REQUEST: TỰ ĐỘNG ĐÍNH KÈM JWT TOKEN VÀO CÁC CUỘC GỌI API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lumina_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🌟 INTERCEPTOR CHO RESPONSE: BẮT LỖI TẬP TRUNG (VÍ DỤ: TOKEN HẾT HẠN)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu Backend trả về lỗi 401 (Unauthorized) - Token hết hạn hoặc bất hợp lệ
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("lumina_token");
      localStorage.removeItem("lumina_user");
    }

    // Kiểm tra nếu không phải đang ở trang login thì sút user về trang login
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
