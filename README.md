# Todolist (React + Vite)

Ứng dụng quản lý công việc có đăng ký/đăng nhập đơn giản, lưu dữ liệu theo từng người dùng bằng LocalStorage. Giao diện dùng Ant Design, định tuyến với React Router.

## Tính năng
- Đăng ký, đăng nhập, đăng xuất
- Bảo vệ trang chính bằng `ProtectedRoute`
- Thêm, đánh dấu hoàn thành, sửa, xóa công việc
- Xóa tất cả công việc đã hoàn thành
- Chống tạo công việc trùng nhau (theo nội dung, không phân biệt hoa thường)
- Todo được lưu theo từng tài khoản (key `todos:<email>`) trong LocalStorage

## Công nghệ sử dụng
- React 18, Vite 5
- React Router DOM 7
- Ant Design 5
- Dayjs (nếu cần xử lý ngày giờ)

## Cấu trúc thư mục chính
```
src/
  context/
    AuthContext.jsx        # Quản lý users/currentUser/todos bằng LocalStorage
  pages/
    Login.jsx              # Trang đăng nhập
    Register.jsx           # Trang đăng ký
    Home.jsx               # Trang quản lý Todo (cần đăng nhập)
  routes/
    ProtectedRoute.jsx     # Chặn truy cập khi chưa đăng nhập
  main.jsx                 # Khởi tạo app, router, provider
  index.css                # Style cơ bản
```

## Cài đặt và chạy
Yêu cầu: Node.js >= 18

1) Cài dependencies
```bash
npm install
```

2) Chạy môi trường phát triển
```bash
npm run dev
```
- Mặc định Vite hiển thị URL cục bộ (ví dụ `http://localhost:5173`).

3) Build production
```bash
npm run build
```
- Kết quả build nằm trong thư mục `dist/`.

4) Xem thử bản build
```bash
npm run preview
```

## Cách sử dụng
1) Mở ứng dụng, nếu chưa có tài khoản hãy vào trang Đăng ký.
2) Đăng nhập bằng email/mật khẩu vừa tạo.
3) Ở trang Home, bạn có thể:
   - Thêm công việc mới.
   - Tích vào checkbox để đánh dấu hoàn thành.
   - Sửa nội dung công việc inline; để trống nội dung và Lưu sẽ gợi ý xóa.
   - Xóa công việc riêng lẻ hoặc xóa tất cả công việc đã hoàn thành.
4) Mỗi người dùng có danh sách công việc riêng lưu trong LocalStorage trình duyệt.

## Lưu ý bảo mật
- Ứng dụng mẫu cho mục đích học tập: mật khẩu được lưu dạng plain-text trong LocalStorage. Không dùng cho môi trường thật.
- Nếu muốn nâng cấp bảo mật, hãy chuyển sang backend thật (API) và cơ chế xác thực phù hợp (JWT/OAuth, hashing mật khẩu, v.v.).

## Troubleshooting
- Không thấy dữ liệu/đăng xuất không hoạt động: thử xóa LocalStorage hoặc mở ứng dụng trong chế độ không theo dõi (guest profile) của trình duyệt.
- Trùng công việc: ứng dụng chặn thêm/sửa thành nội dung trùng (không phân biệt hoa thường).
- Port đang bận khi `npm run dev`: thêm cờ `--port 5174` hoặc đổi cổng khác trong `vite.config.js`.

## License
MIT
