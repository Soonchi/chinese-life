# Chinese Life 2.0

Game mô phỏng cuộc sống kết hợp luyện tiếng Trung.

## Chạy local
Mở `index.html` bằng trình duyệt.

## Deploy GitHub Pages
1. Tạo repository GitHub mới, ví dụ `chinese-life`.
2. Upload toàn bộ nội dung thư mục này lên thư mục gốc của repository.
3. Vào **Settings → Pages**.
4. Trong **Build and deployment**, chọn **Deploy from a branch**.
5. Chọn branch `main`, folder `/(root)`, nhấn **Save**.
6. Đợi GitHub Pages deploy xong. Địa chỉ thường có dạng `https://<username>.github.io/chinese-life/`.

Lưu ý: GitHub Pages là website công khai. Không đưa dữ liệu riêng tư hoặc bí mật vào repository.


## Chinese Life 3.1 — Hành trình chinh phục Trung Hoa
- Thêm chiến dịch cốt truyện 6 chương tương ứng HSK 1–6, mỗi chương có 2 thử thách giao tiếp.
- Mở khóa chương tiếp theo sau khi hoàn thành các thử thách trước.
- Thử thách chiến dịch dùng SpeechRecognition tiếng Trung (zh-CN); câu trả lời chỉ được ghi nhận khi transcript khớp một trong các đáp án hợp lệ.
- Thêm joystick cảm ứng dạng analog trong khu vực game; vẫn giữ nút điều khiển và bàn phím cũ.
- Thêm phần thưởng EXP/tiền và lưu tiến độ chiến dịch riêng trong localStorage.
- Nội dung 3.1 được tách thành `v3.1.css` và `v3.1.js`, giữ nguyên game 2.0 bên dưới.

### Lưu ý
- Nhận diện giọng nói tùy trình duyệt/thiết bị; cần HTTPS, quyền microphone và thường cần kết nối mạng. iOS Safari có thể không hỗ trợ Web Speech Recognition ổn định.
- Đây là kiểm tra transcript (nội dung câu nói), chưa phải chấm chất lượng phát âm/4 thanh điệu. Chấm thanh điệu cần dịch vụ phoneme/prosody chuyên dụng.
- Câu hỏi và đáp án hiện là bộ nội dung khởi đầu cho chiến dịch; chưa phải ngân hàng đề HSK đầy đủ hoặc AI NPC hội thoại tự do.


## Chinese Life 3.2 — Thế giới pixel Vân Hải
- Thay khu vực cảnh cũ bằng bản đồ pixel-art vẽ bằng Canvas, có 7 khu vực: khu phố, phố thương mại, ngõ ẩm thực, nhà, công viên, học viện và trung tâm thương mại.
- Di chuyển tự do bằng joystick analog, WASD/phím mũi tên hoặc D-pad; có giới hạn bản đồ và va chạm với công trình/vật thể lớn.
- NPC xuất hiện theo từng khu vực, có chuyển động nhàn rỗi/tuần tra nhẹ; chạm NPC hoặc đến gần rồi bấm tương tác để mở hội thoại hiện có.
- Thêm mức độ thân thiết, điểm quan hệ và quà tặng (trà/sách) sử dụng tiền trong game.
- Bản đồ thành phố cho phép chuyển nhanh giữa 7 khu vực.
- Giữ nguyên save game, chiến dịch HSK 1–6 và dữ liệu cũ; quan hệ NPC lưu riêng trong localStorage.

### Lưu ý 3.2
- Đồ họa pixel hiện được vẽ bằng Canvas và các hình khối pixel, chưa phải bộ sprite-sheet/animation vẽ tay chuyên nghiệp.
- NPC hiện có chuyển động tuần tra nhẹ và nhãn thời gian trong ngày; chưa có lịch AI phức tạp, hội thoại tự do hay đường đi tìm đường (pathfinding).


## Chinese Life 3.3 — Controller HUD
- Thay giao diện nhiều bảng/nút hiển thị sẵn bằng màn hình game tập trung vào thế giới pixel.
- Ẩn header, quest card, navigation và các bảng cũ khỏi giao diện chính nhưng giữ nguyên DOM và logic để không mất chức năng/dữ liệu.
- Thêm HUD nhỏ hiển thị cấp độ, EXP, tiền và khu vực hiện tại.
- Thêm dock điều khiển; click MENU, NHIỆM VỤ, BẢN ĐỒ, TÚI ĐỒ, HỌC TẬP hoặc ĐỜI SỐNG để mở bảng chức năng, click lại hoặc nhấn X để thu gọn.
- Giữ joystick, nút tương tác NPC, quan hệ NPC, chiến dịch HSK và các chức năng cũ; tối ưu bố cục cho màn hình cảm ứng.
