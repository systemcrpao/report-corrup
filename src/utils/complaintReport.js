import { toDate, formatThaiDateTime } from "./statsUtils.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatReportDate(date) {
  if (!date) return "-";
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * @param {Record<string, unknown>} complaint
 */
export function buildComplaintReportHtml(complaint) {
  const created = toDate(complaint.createdAt);
  const updated = toDate(complaint.updatedAt);
  const reportDate = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const locationLine = [
    complaint.location?.address,
    complaint.location?.subDistrict ? `ต.${complaint.location.subDistrict}` : "",
    complaint.location?.district ? `อ.${complaint.location.district}` : "",
    complaint.location?.province ? `จ.${complaint.location.province}` : "จ.เชียงราย",
  ]
    .filter(Boolean)
    .join(" ");

  const evidenceCount = complaint.evidenceUrls?.length ?? 0;

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <title>รายงานเรื่องร้องเรียน ${escapeHtml(complaint.trackingId)}</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    body {
      font-family: "Sarabun", "Segoe UI", sans-serif;
      color: #111;
      line-height: 1.65;
      font-size: 14px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #1e4d8c;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .org { font-size: 18px; font-weight: 700; color: #1e4d8c; }
    .title { font-size: 16px; font-weight: 700; margin-top: 6px; }
    .meta { margin: 12px 0 18px; }
    .meta p { margin: 4px 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 18px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      vertical-align: top;
      text-align: left;
    }
    th {
      width: 28%;
      background: #f1f5f9;
      font-weight: 700;
    }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #1e4d8c;
      margin: 18px 0 8px;
    }
    .detail-box {
      border: 1px solid #cbd5e1;
      padding: 12px;
      min-height: 120px;
      white-space: pre-wrap;
    }
    .footer {
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      gap: 24px;
    }
    .sign-box {
      width: 48%;
      text-align: center;
    }
    .sign-line {
      margin-top: 56px;
      border-top: 1px solid #111;
      padding-top: 6px;
    }
    .note {
      margin-top: 18px;
      font-size: 12px;
      color: #475569;
    }
    @media print {
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="org">องค์การบริหารส่วนจังหวัดเชียงราย</div>
    <div class="title">รายงานเรื่องร้องเรียนการทุจริต / การประพฤติมิชอบ / การละเว้นการปฏิบัติหน้าที่</div>
    <div>(สำหรับเสนอผู้บริหาร — รายเรื่อง)</div>
  </div>

  <div class="meta">
    <p><strong>วันที่จัดทำรายงาน:</strong> ${escapeHtml(reportDate)}</p>
    <p><strong>รหัสอ้างอิง:</strong> ${escapeHtml(complaint.trackingId)}</p>
  </div>

  <table>
    <tr>
      <th>ประเภทเรื่อง</th>
      <td>${escapeHtml(complaint.category)}</td>
    </tr>
    <tr>
      <th>สถานะปัจจุบัน</th>
      <td>${escapeHtml(complaint.status)}</td>
    </tr>
    <tr>
      <th>วันที่รับแจ้ง</th>
      <td>${escapeHtml(created ? formatThaiDateTime(created) : "-")}</td>
    </tr>
    <tr>
      <th>อัปเดตล่าสุด</th>
      <td>${escapeHtml(updated ? formatThaiDateTime(updated) : "-")}</td>
    </tr>
    <tr>
      <th>สถานที่เกิดเหตุ</th>
      <td>${escapeHtml(locationLine || "-")}</td>
    </tr>
    <tr>
      <th>ผู้แจ้ง</th>
      <td>${escapeHtml(complaint.informantName || "ไม่เปิดเผยตัวตน")}</td>
    </tr>
    <tr>
      <th>ช่องทางติดต่อ</th>
      <td>${escapeHtml(complaint.informantContact || "-")}</td>
    </tr>
    <tr>
      <th>หลักฐานแนบ</th>
      <td>${evidenceCount} ไฟล์</td>
    </tr>
  </table>

  <div class="section-title">รายละเอียดเรื่องร้องเรียน</div>
  <div class="detail-box">${escapeHtml(complaint.details || "-")}</div>

  <div class="section-title">บันทึกการดำเนินการ (เจ้าหน้าที่)</div>
  <div class="detail-box">${escapeHtml(complaint.adminNotes || "—")}</div>

  <div class="footer">
    <div class="sign-box">
      <div class="sign-line">ผู้จัดทำรายงาน</div>
    </div>
    <div class="sign-box">
      <div class="sign-line">ผู้บริหาร / ผู้รับทราบ</div>
    </div>
  </div>

  <p class="note">
    เอกสารฉบับนี้จัดทำจากระบบร้องเรียนการทุจริต องค์การบริหารส่วนจังหวัดเชียงราย
    วันที่พิมพ์ ${escapeHtml(formatReportDate(new Date()))}
  </p>
</body>
</html>`;
}

/**
 * @param {Record<string, unknown>} complaint
 */
export function printComplaintReport(complaint) {
  const html = buildComplaintReportHtml(complaint);
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");

  if (!printWindow) {
    throw new Error("POPUP_BLOCKED");
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

/**
 * @param {Array<Record<string, unknown>>} complaints
 */
export function printComplaintsSummaryReport(complaints) {
  const reportDate = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const rows = complaints
    .map((item, index) => {
      const created = toDate(item.createdAt);
      return `<tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(item.trackingId)}</td>
        <td>${escapeHtml(item.category)}</td>
        <td>${escapeHtml(item.location?.district ?? "-")}</td>
        <td>${escapeHtml(item.status)}</td>
        <td>${escapeHtml(created ? formatThaiDateTime(created) : "-")}</td>
      </tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <title>สรุปรายงานเรื่องร้องเรียน</title>
  <style>
    @page { size: A4 landscape; margin: 14mm; }
    body { font-family: "Sarabun", "Segoe UI", sans-serif; font-size: 13px; }
    h1 { text-align: center; color: #1e4d8c; font-size: 18px; }
    p.meta { text-align: center; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; }
    th { background: #f1f5f9; }
  </style>
</head>
<body>
  <h1>สรุปรายงานเรื่องร้องเรียน — องค์การบริหารส่วนจังหวัดเชียงราย</h1>
  <p class="meta">วันที่จัดทำรายงาน: ${escapeHtml(reportDate)} | จำนวน ${complaints.length} เรื่อง</p>
  <table>
    <thead>
      <tr>
        <th>ลำดับ</th>
        <th>รหัสอ้างอิง</th>
        <th>ประเภท</th>
        <th>อำเภอ</th>
        <th>สถานะ</th>
        <th>วันที่แจ้ง</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1000,height=700");
  if (!printWindow) throw new Error("POPUP_BLOCKED");

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
