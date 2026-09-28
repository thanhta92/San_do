# TÀI LIỆU ĐẶC TẢ KỸ THUẬT & QUY TẮC NGHIỆP VỤ
## PHẦN MỀM BIỂU ĐỒ CHUYỂN DẠ (PARTOGRAPH)
**Mã số biểu mẫu:** `MS: TD-03` • `MĐPN.028.PS.02.028` • Chuẩn Bệnh viện Mỹ Đức Phú Nhuận & Bộ Y Tế

---

## 1. TỔNG QUAN HỆ THỐNG & TIÊU CHUẨN Y TẾ
Biểu đồ chuyển dạ (Partograph) là công cụ theo dõi động tiến triển chuyển dạ của sản phụ trong pha hoạt động (cổ tử cung $\ge 4\text{ cm}$), giúp nhân viên y tế phát hiện sớm các dấu hiệu bất thường (chuyển dạ kéo dài, bất tương xứng đầu chậu, suy thai) để xử trí kịp thời.

- **Tiêu chuẩn biểu mẫu:** `MS: TD-03`.
- **Nền tảng:** Web tương tác trực quan, hỗ trợ in ấn A4 chuẩn hồ sơ bệnh án điện tử.

---

## 2. QUY CHUẨN TỶ LỆ LƯỚI MA TRẬN & CO GIÃN THỜI GIAN THỰC

### 2.1. Tỷ lệ trục thời gian (Time-scaled Dynamic Grid)
1. **Tỷ lệ chuẩn:** `1 phút = 1px` (`CONFIG.pxPerMinute = 1.0`).
2. **Khoảng cách 60 phút chuẩn:** `60px` (tương đương $\approx \mathbf{1.59\text{ cm}}$ theo chuẩn in ấn & hiển thị 96 DPI).
3. **Độ rộng tối thiểu giữa 2 mốc (Min Width):** `50px` (đảm bảo không bị bóp nghẹt nội dung chữ và số khi 2 mốc khám sát nhau $\le 30$ phút).
4. **Công thức co giãn cột theo thời gian thực:**
   $$\text{Độ rộng cột } i = \max\Big(50\text{px},\; (\text{Thời gian mốc } i+1 - \text{Thời gian mốc } i) \times 1\text{px}\Big)$$
5. **Cột mốc cuối cùng (Last Observation Column):** Tự động mở rộng gấp đôi cột chuẩn ($x2 = \mathbf{120\text{px}}$) để hiển thị đầy đủ và thoáng đãng nội dung văn bản dài do phía sau chưa có mốc mới.
6. **Số cột tối thiểu:** Hiển thị ít nhất 10 cột chuẩn (600px) bao quát trọn vẹn đường Báo Động và Hành Động.

### 2.2. Cơ chế tự động mở rộng chiều cao hàng văn bản đa dòng (Dynamic Row-Height)
Hệ thống tự động đo lường `scrollHeight` và `offsetHeight` thực tế của 3 hàng chứa nội dung dài (*Thuốc đã dùng*, *Ghi nhận lâm sàng*, *NHS thực hiện*) trên toàn bộ các cột và tự động đồng bộ chiều cao hàng (thông qua biến CSS `--h-drugs`, `--h-clinical`, `--h-nhs`) để hiển thị trọn vẹn 100% nội dung chữ, không bị che khuất hay cắt xén.

---

## 3. QUY ĐỊNH RÀNG BUỘC & KIỂM SOÁT NHẬP LIỆU (VALIDATION & MASKING)

Toàn bộ các trường số được thiết lập chế độ **kiểm soát tức thì (Realtime Masking & Clamping)**: chặn tối đa ký tự ngay khi đang gõ (`maxlength`) và tự động giới hạn về cận trần/sàn:

| Chỉ số / Trường | Định dạng | Giới hạn (Min - Max) | Maxlength | Quy tắc kiểm soát thời gian thực |
| :--- | :--- | :--- | :---: | :--- |
| **Giờ khám** (`#inputObsTime`) | 24 giờ (`HH:mm`) | `00:00` - `23:59` | 5 ký tự | Gõ 4 số (vd `2359`) $\rightarrow$ tự động chuyển `23:59`. Giờ 00-23, Phút 00-59. |
| **Ngày khám** (`#inputObsDate`) | `dd/MM/yyyy` | `01/01/2026` - `31/12/2099` | 10 ký tự | Gõ 8 số (vd `12102026`) $\rightarrow$ tự động chuyển `12/10/2026`. Tự nhận biết số ngày theo tháng và năm nhuận. |
| **Tim thai** (`#inputFHR`) | Số nguyên | `0` - `250` bpm | 3 chữ số | Tối đa 3 chữ số. Nếu gõ $> 250$ tự động clamp thành `250`. Cảnh báo đỏ khi $< 110$ hoặc $> 160$ bpm. |
| **Mở CTC** (`#inputDilation`) | Số thập phân (bước 0.5) | `4.0` - `10.5` cm | 4 ký tự | Gõ `4` $\rightarrow$ `4.0`; gõ `45` $\rightarrow$ `4.5`; gõ `10` $\rightarrow$ `10.0`; gõ `105` $\rightarrow$ `10.5`. Chặn $> 10.5$. |
| **Số cơn gò / 10p** (`#inputContractionCount`) | Số nguyên | `1` - `6` cơn | 1 chữ số | Chỉ nhận số từ 1 đến 6. Gõ `0` $\rightarrow$ `1`, gõ `7, 8, 9` $\rightarrow$ `6`. |
| **Thời gian gò** (`#inputContractionDur`) | Dropdown | 3 mức thời lượng | - | `< 20 (s)` (nhẹ), `20 - 40 (s)` (vừa), `> 40 (s)` (mạnh). |
| **Độ lọt ngôi thai** (`#inputDescent`) | Dropdown | `-3` đến `+3` | - | 7 mức: `-3`, `-2`, `-1`, `0`, `+1`, `+2`, `+3`. |
| **Chồng khớp sọ** (`#inputMolding`) | Dropdown | 4 mức | - | `0`, `+`, `++`, `+++`. Cảnh báo đỏ khi `++` hoặc `+++`. |
| **Tình trạng ối** (`#inputLiquor`) | Dropdown | 8 trạng thái | - | Menu hiển thị chữ đầy đủ; Biểu đồ hiển thị ký hiệu: `C` (Còn), `TĐ` (Trắng đục), `TT` (Trắng trong), `X` (Xanh), `V` (Vàng), `Đ` (Đỏ), `K` (Không rõ), `↓` (Ối vỡ/Bấm ối). |
| **Mạch** (`#inputPulse`) | Số nguyên | `0` - `250` l/p | 3 chữ số | Tối đa 3 chữ số. Clamp $\le 250$. Cảnh báo đỏ khi $\ge 100$ hoặc $< 60$ l/p. |
| **Huyết áp** (`#inputBpCombined`) | `Tâm thu / Tâm trương` | `0` - `250` mmHg | 7 ký tự | Gõ 5-6 số liền (vd `12080`) $\rightarrow$ tự tách `120/80`. Cảnh báo khi Tâm thu $\ge 140$ hoặc Tâm trương $\ge 90$ / $< 60$. |
| **Thân nhiệt** (`#inputTemp`) | Thập phân 1 số lẻ | `34.0` - `45.0` °C | 4 ký tự | Gõ `378` $\rightarrow$ `37.8`. Cảnh báo khi $\ge 38.0^\circ\text{C}$ hoặc $< 36.0^\circ\text{C}$. |
| **Nước tiểu: Lượng** (`#inputUrineVolume`) | Số nguyên | `0` - `2000` ml | 4 chữ số | Tối đa 4 chữ số, clamp $\le 2000$. |
| **Nước tiểu: Đạm / Ceton** | Dropdown | `-`, `+` | - | `-` (Âm tính), `+` (Dương tính - cảnh báo đỏ). |
| **Oxytocin** (`#inputOxytocinVal`) | Thập phân / Chữ | `0` - `20.0` | 5 ký tự | Gõ `345` $\rightarrow$ `3.45`, `125` $\rightarrow$ `12.5`. Clamp trần `20.0`. Đơn vị: *giọt/phút* hoặc *ml/giờ* đồng bộ toàn ca. |

---

## 4. QUY TẮC ĐỒ THỊ & CẢNH BÁO LÂM SÀNG (SVG OVERLAY)

1. **Đường Báo Động (Alert Line):**
   - Bắt đầu từ mốc đầu tiên có độ mở CTC $\ge 4\text{ cm}$.
   - Độ dốc: $1\text{ cm/giờ}$ trong 6 giờ $\rightarrow$ kết thúc tại vạch $10\text{ cm}$ sau 6 giờ ($360\text{px}$).
   - Đổi màu đỏ rực (`#dc2626`) khi đường mở CTC nằm lệch về bên phải đường Báo Động.
2. **Đường Hành Động (Action Line):**
   - Nằm song song và cách đường Báo Động 4 giờ ($240\text{px}$) về bên phải.
   - Đổi màu đỏ rực (`#dc2626`) khi đường mở CTC chạm hoặc vượt qua đường Hành Động (chỉ định can thiệp cấp cứu).
3. **Độ mở cổ tử cung:** Ký hiệu `X`, nối đường liền màu đen.
4. **Độ lọt ngôi thai:** Ký hiệu `O`, nối đường nét đứt màu đen.
5. **Nhịp tim thai (FHR):** Ký hiệu chấm tròn `●` kèm số, đổi màu đỏ khi bất thường.
6. **Cơn co tử cung:** Chồng các khối từ 1 đến 6 theo thời lượng (sọc thưa, sọc caro, tô đặc).
7. **Mạch & Huyết áp:** Mạch ký hiệu chấm tròn `●`; Huyết áp ký hiệu mũi tên `▲—▼` nối giữa 2 trị số.

---

## 5. QUY TRÌNH & TRẢI NGHIỆM NGƯỜI DÙNG (UX / WORKFLOW)

1. **Mở form:** Tự động điền ngày hiện tại, giờ hiện tại (24h), tên NHS và đơn vị Oxytocin đồng nhất.
2. **Tính năng "Link từ tờ chăm sóc":** Tìm kiếm và nạp nhanh toàn bộ chỉ số từ hồ sơ bệnh án điện tử chỉ với 1 click.
3. **Tính năng nạp nhanh giá trị mốc trước (Quick Load Previous Value):** 4 icon lịch sử nhỏ kế bên nhãn của **Đạm niệu**, **Keton niệu**, **Oxytocin** và **Thuốc đã dùng** cho phép nạp lại tức thì giá trị từ mốc khám liền kề trước đó.
4. **Hành vi Lưu (Enter / Nút Lưu):** Bấm Enter hoặc nút Lưu sẽ lưu mốc và vẽ lại biểu đồ ngay lập tức; **form giữ nguyên trạng thái mở** để tiện xem và sửa tiếp. Muốn đóng thì bấm nút `✕` hoặc `Hủy`.
5. **Cảnh báo khoảng cách mốc:** Cảnh báo an toàn nếu mốc mới cách mốc gần nhất $< 30$ phút.
