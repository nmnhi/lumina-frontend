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
    // Chỉ redirect về login khi Backend trả về 401 (Unauthorized) — token hết hạn/không hợp lệ
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("lumina_token");
      localStorage.removeItem("lumina_user");

      // Tránh loop redirect khi đã ở trang login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
