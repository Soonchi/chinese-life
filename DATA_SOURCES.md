# Nguồn dữ liệu từ vựng và nghĩa tiếng Việt

## Danh sách từ HSK 1–6
- Danh sách từ, pinyin và cấp HSK: dữ liệu chương trình HSK được ghi nguồn trong `data/hsk-vocab.json`.
- Nghĩa tiếng Việt: tham chiếu từ **CVDICT** của Phong Phan: https://github.com/ph0ngp/CVDICT
- CVDICT được chuyển dịch từ **CC-CEDICT**: https://www.mdbg.net/chinese/dictionary
- Giấy phép dữ liệu nghĩa: **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.
- Bản nghĩa trong `data/hsk-meaning-vi.json` là dữ liệu phái sinh đã được ghép theo chữ Hán và pinyin; một số từ thông dụng và trường hợp thiếu/không khớp được biên tập lại thủ công.

## Lưu ý chất lượng
CVDICT ghi rõ bản dịch có sử dụng AI và đã được tác giả kiểm tra, chỉnh sửa một phần; vẫn có thể còn lỗi. Vì vậy không tuyên bố mọi nghĩa đã được chuyên gia hiệu đính tuyệt đối. App không còn gọi máy dịch trực tiếp khi người học mở từ; nghĩa hiển thị lấy từ bộ dữ liệu cố định để tránh kết quả dịch ngẫu nhiên theo từng lần tra.

Khi phát hiện nghĩa chưa chuẩn, cần sửa trong `data/hsk-meaning-vi.json` và kiểm tra lại theo ngữ cảnh, từ loại, pinyin trước khi phát hành.
