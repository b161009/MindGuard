import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "E:/Mind_Guard/outputs";
const outputPath = `${outputDir}/mindguard-mo-phong-23-nguoi.xlsx`;
const rows = [
  ["SIM-01", "Ngày học ổn định", "2026-09-01", 8, 8, 2, 8, 8, 8, 7, "Hôm nay mình hoàn thành việc học và thấy nhẹ nhàng.", "tích cực", "Không", "Bình thường", "Không"],
  ["SIM-02", "Thiếu ngủ nhẹ", "2026-09-02", 6, 6, 5, 4, 5, 6, 6, "Mình ngủ muộn nên hơi mệt, nhưng vẫn ổn.", "mệt mỏi", "Quá tải nhẹ", "Cần chú ý", "Không"],
  ["SIM-03", "Áp lực bài tập", "2026-09-03", 4, 4, 8, 4, 3, 5, 5, "Bài tập dồn nhiều làm mình thấy áp lực.", "căng thẳng", "Quá tải", "Cần chú ý", "Không"],
  ["SIM-04", "Kết nối tích cực", "2026-09-04", 9, 8, 2, 7, 8, 8, 9, "Mình vừa nói chuyện vui với bạn bè.", "tích cực", "Không", "Bình thường", "Không"],
  ["SIM-05", "Buồn kéo dài", "2026-09-05", 2, 3, 7, 3, 2, 2, 2, "Mình thấy buồn và không muốn làm gì hôm nay.", "buồn", "Cô lập", "Nên tìm hỗ trợ", "Không"],
  ["SIM-06", "Ngày bình thường", "2026-09-06", 7, 7, 3, 7, 7, 7, 6, "Một ngày bình thường, mình muốn nghỉ ngơi sớm.", "trung tính", "Không", "Bình thường", "Không"],
  ["SIM-07", "Lo lắng trước kỳ thi", "2026-09-07", 4, 4, 8, 5, 4, 4, 4, "Mình lo lắng vì sắp thi và khó tập trung.", "căng thẳng", "Quá tải", "Cần chú ý", "Không"],
  ["SIM-08", "Hồi phục", "2026-09-08", 8, 7, 3, 8, 8, 7, 7, "Mình ngủ đủ và thấy có năng lượng hơn.", "tích cực", "Không", "Bình thường", "Không"],
  ["SIM-09", "Cô đơn", "2026-09-09", 3, 3, 6, 4, 3, 3, 1, "Mình thấy cô đơn và chưa muốn gặp ai.", "buồn", "Cô lập", "Cần chú ý", "Không"],
  ["SIM-10", "Khó chịu", "2026-09-10", 5, 3, 7, 5, 5, 4, 5, "Mình dễ cáu và thấy mọi việc không thuận.", "tức giận", "Quá tải", "Cần chú ý", "Không"],
  ["SIM-11", "Ngày tích cực", "2026-09-11", 9, 9, 1, 8, 9, 9, 8, "Mình thấy vui và muốn làm nhiều việc.", "tích cực", "Không", "Bình thường", "Không"],
  ["SIM-12", "Mất động lực", "2026-09-12", 3, 4, 6, 4, 3, 1, 3, "Mình thiếu động lực và thấy ngày hôm nay rất dài.", "buồn", "Quá tải", "Cần chú ý", "Không"],
  ["SIM-13", "Nghỉ ngơi", "2026-09-13", 7, 8, 2, 9, 7, 7, 6, "Mình dành thời gian nghỉ ngơi và thấy ổn.", "trung tính", "Không", "Bình thường", "Không"],
  ["SIM-14", "Bế tắc", "2026-09-14", 2, 2, 8, 2, 2, 2, 1, "Mình thấy bế tắc và không biết nên chia sẻ với ai.", "buồn", "Tuyệt vọng, Cô lập", "Nên tìm hỗ trợ", "Không"],
  ["SIM-15", "Làm việc quá sức", "2026-09-15", 4, 4, 9, 3, 2, 3, 4, "Mình đang kiệt sức vì cố làm quá nhiều việc.", "mệt mỏi", "Quá tải", "Nên tìm hỗ trợ", "Không"],
  ["SIM-16", "Khởi sắc", "2026-09-16", 8, 7, 3, 7, 8, 8, 7, "Mình đã giải quyết được việc quan trọng và nhẹ nhõm.", "tích cực", "Không", "Bình thường", "Không"],
  ["SIM-17", "Mâu thuẫn", "2026-09-17", 4, 3, 7, 5, 4, 5, 4, "Mình bực bội sau một cuộc tranh cãi.", "tức giận", "Quá tải", "Cần chú ý", "Không"],
  ["SIM-18", "Lo lắng nhẹ", "2026-09-18", 6, 5, 6, 5, 5, 6, 5, "Mình hơi lo cho việc ngày mai nhưng vẫn xoay xở được.", "căng thẳng", "Không", "Cần chú ý", "Không"],
  ["SIM-19", "Ổn định", "2026-09-19", 7, 7, 4, 7, 6, 7, 7, "Mình thấy tương đối ổn định hôm nay.", "trung tính", "Không", "Bình thường", "Không"],
  ["SIM-20", "Cần được ở bên", "2026-09-20", 1, 2, 9, 2, 1, 1, 1, "Mình cảm thấy không an toàn và cần một người ở bên ngay.", "buồn", "An toàn khẩn cấp", "Nên tìm hỗ trợ", "Có"],
  ["SIM-21", "Tập trung trở lại", "2026-09-21", 7, 6, 4, 6, 7, 7, 6, "Mình quay lại nhịp học tập và thấy dễ tập trung hơn.", "tích cực", "Không", "Bình thường", "Không"],
  ["SIM-22", "Mệt sau hoạt động", "2026-09-22", 5, 5, 5, 4, 3, 5, 6, "Mình mệt sau nhiều hoạt động và cần ngủ sớm.", "mệt mỏi", "Không", "Cần chú ý", "Không"],
  ["SIM-23", "Chủ động tìm giúp đỡ", "2026-09-23", 3, 3, 8, 3, 3, 2, 2, "Mình đang rất căng thẳng và muốn nói chuyện với người đáng tin cậy.", "căng thẳng", "Quá tải, Cô lập", "Nên tìm hỗ trợ", "Không"],
];

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Tóm tắt");
const data = workbook.worksheets.add("Dữ liệu mô phỏng");

summary.showGridLines = false;
summary.getRange("A1:G1").merge();
summary.getRange("A1").values = [["DỮ LIỆU MÔ PHỎNG KỸ THUẬT — KHÔNG PHẢI THỰC NGHIỆM NGƯỜI DÙNG"]];
summary.getRange("A1:G1").format = { fill: "#7F1D1D", font: { name: "Arial", bold: true, color: "#FFFFFF", size: 12 }, horizontalAlignment: "center", verticalAlignment: "center" };
summary.getRange("A2:G2").merge();
summary.getRange("A2").values = [["23 hồ sơ tổng hợp để kiểm thử check-in, biểu đồ, Risk Score và luồng hỗ trợ. Không dùng làm số liệu kết luận trong báo cáo KHKT."]];
summary.getRange("A2:G2").format = { font: { name: "Arial", italic: true, color: "#4B5563", size: 10 }, wrapText: true };
summary.getRange("A4:D4").values = [["Mức phản hồi", "Số hồ sơ", "Tỷ lệ", "Mục đích kiểm thử"]];
summary.getRange("A4:D4").format = { fill: "#1F4E78", font: { name: "Arial", bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
summary.getRange("A5:A7").values = [["Bình thường"], ["Cần chú ý"], ["Nên tìm hỗ trợ"]];
summary.getRange("B5").formulas = [["=COUNTIF('Dữ liệu mô phỏng'!N2:N24,A5)"]];
summary.getRange("B5:B7").fillDown();
summary.getRange("C5").formulas = [["=B5/COUNTA('Dữ liệu mô phỏng'!A2:A24)"]];
summary.getRange("C5:C7").fillDown();
summary.getRange("D5:D7").values = [["Luồng lưu trữ và biểu đồ"], ["Phản hồi và theo dõi xu hướng"], ["Màn hình hỗ trợ và cảnh báo"]];
summary.getRange("A4:D7").format.borders = { preset: "all", style: "thin", color: "#D9D9D9" };
summary.getRange("C5:C7").format.numberFormat = "0.0%";
summary.getRange("A10:G10").merge();
summary.getRange("A10").values = [["Ghi chú sử dụng: Mỗi hàng là một tình huống tổng hợp, không đại diện cho cá nhân thật. Khi thực nghiệm thật, thay bảng này bằng dữ liệu có đồng ý tham gia và khử định danh."]];
summary.getRange("A10:G10").format = { fill: "#FFF7ED", font: { name: "Arial", color: "#7C2D12", size: 10 }, wrapText: true };
summary.getRange("A1:G10").format.font = { name: "Arial", size: 10 };
summary.getRange("A1:G1").format.rowHeight = 26;
summary.getRange("A2:G2").format.rowHeight = 32;
summary.getRange("A10:G10").format.rowHeight = 38;
summary.getRange("A:D").format.columnWidth = 24;
summary.getRange("E:G").format.columnWidth = 14;

const headers = ["Mã mô phỏng", "Tình huống", "Ngày", "Mood", "Comfort", "Stress", "Sleep", "Energy", "Interest", "Social", "Nội dung check-in mô phỏng", "Cảm xúc kỳ vọng", "Tín hiệu kỳ vọng", "Mức phản hồi kỳ vọng", "Cần hỗ trợ con người", "Risk Score định lượng"];
data.getRange("A1:P24").values = [headers, ...rows.map((row) => [...row, null])];
data.getRange("P2").formulas = [["=ROUND(MAX(0,F2-3)*3.2+MAX(0,6-D2)*3.2+MAX(0,6-E2)*2+MAX(0,6-G2)*2.5+MAX(0,6-H2)*2.5+MAX(0,6-I2)*2+MAX(0,4-J2),0)"]];
data.getRange("P2:P24").fillDown();
data.getRange("A1:P1").format = { fill: "#1F4E78", font: { name: "Arial", bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
data.getRange("A1:P24").format.font = { name: "Arial", size: 10 };
data.getRange("A1:P24").format.borders = { preset: "all", style: "thin", color: "#D9D9D9" };
data.getRange("A2:P24").format.verticalAlignment = "center";
data.getRange("C2:C24").format.numberFormat = "yyyy-mm-dd";
data.getRange("D2:J24").format.horizontalAlignment = "center";
data.getRange("N2:N24").format.horizontalAlignment = "center";
data.getRange("O2:O24").format.horizontalAlignment = "center";
data.getRange("P2:P24").format.horizontalAlignment = "center";
data.getRange("A:A").format.columnWidth = 14;
data.getRange("B:B").format.columnWidth = 21;
data.getRange("C:C").format.columnWidth = 12;
data.getRange("D:J").format.columnWidth = 10;
data.getRange("K:K").format.columnWidth = 48;
data.getRange("L:M").format.columnWidth = 20;
data.getRange("N:O").format.columnWidth = 20;
data.getRange("P:P").format.columnWidth = 18;
data.getRange("K2:K24").format.wrapText = true;
data.getRange("A1:P1").format.rowHeight = 32;
data.getRange("A2:P24").format.rowHeight = 32;
data.freezePanes.freezeRows(1);
data.tables.add("A1:P24", true, "SimulationTable");
data.getRange("N2:N24").conditionalFormats.add("containsText", { text: "Nên tìm hỗ trợ", format: { fill: "#FDE2E2", font: { color: "#991B1B", bold: true } } });
data.getRange("N2:N24").conditionalFormats.add("containsText", { text: "Cần chú ý", format: { fill: "#FEF3C7", font: { color: "#92400E", bold: true } } });
data.getRange("O2:O24").conditionalFormats.add("containsText", { text: "Có", format: { fill: "#FECACA", font: { color: "#991B1B", bold: true } } });

await fs.mkdir(outputDir, { recursive: true });
const preview = await workbook.render({ sheetName: "Tóm tắt", range: "A1:G10", scale: 1.5, format: "png" });
await fs.writeFile(`${outputDir}/mindguard-mo-phong-23-nguoi-preview.png`, new Uint8Array(await preview.arrayBuffer()));
const dataPreview = await workbook.render({ sheetName: "Dữ liệu mô phỏng", range: "A1:P12", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/mindguard-mo-phong-23-nguoi-data-preview.png`, new Uint8Array(await dataPreview.arrayBuffer()));
const file = await SpreadsheetFile.exportXlsx(workbook);
await file.save(outputPath);

const check = await workbook.inspect({ kind: "table", range: "Dữ liệu mô phỏng!A1:P24", include: "values,formulas", tableMaxRows: 24, tableMaxCols: 16 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 50 }, summary: "formula error scan" });
console.log(errors.ndjson);
console.log(outputPath);
