import { useState } from "react";
import { trackComplaint } from "../services/trackingService.js";

function formatTimestamp(timestamp) {
  if (!timestamp?.toDate) return "-";
  return timestamp.toDate().toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusClass(status) {
  switch (status) {
    case "รอดำเนินการ":
      return "status-pending";
    case "กำลังตรวจสอบ":
      return "status-progress";
    case "ยุติเรื่อง":
      return "status-closed";
    default:
      return "";
  }
}

export default function TrackingForm() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setNotFound(false);

    const trimmed = trackingId.trim();
    if (!trimmed) {
      setError("กรุณากรอกรหัสอ้างอิง");
      return;
    }

    setIsLoading(true);

    try {
      const data = await trackComplaint(trimmed);
      if (!data) {
        setNotFound(true);
        return;
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถค้นหาสถานะได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  }

  const historyItems = result?.statusHistory
    ? [...result.statusHistory].reverse()
    : [];

  return (
    <div className="tracking-panel">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="trackingId">รหัสอ้างอิง (Tracking ID)</label>
          <input
            id="trackingId"
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="CR-1718192021"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
          {isLoading ? "กำลังค้นหา..." : "ตรวจสอบสถานะ"}
        </button>
      </form>

      {notFound && (
        <div className="alert alert-warning" role="status">
          ไม่พบรหัสอ้างอิงนี้ในระบบ กรุณาตรวจสอบและลองใหม่อีกครั้ง
        </div>
      )}

      {result && (
        <div className="result-card">
          <h3>ผลการติดตาม</h3>
          <dl className="result-list">
            <div>
              <dt>รหัสอ้างอิง</dt>
              <dd>{result.trackingId}</dd>
            </div>
            <div>
              <dt>สถานะปัจจุบัน</dt>
              <dd>
                <span className={`status-badge ${getStatusClass(result.status)}`}>
                  {result.status}
                </span>
              </dd>
            </div>
            <div>
              <dt>อัปเดตล่าสุด</dt>
              <dd>{formatTimestamp(result.updatedAt)}</dd>
            </div>
          </dl>

          {result.adminNotes ? (
            <div className="staff-notes-box">
              <h4>ความเห็นเจ้าหน้าที่ล่าสุด</h4>
              <p>{result.adminNotes}</p>
            </div>
          ) : null}

          {historyItems.length > 0 && (
            <div className="status-timeline">
              <h4>ประวัติการดำเนินการ</h4>
              <ol>
                {historyItems.map((entry, index) => (
                  <li key={`${entry.status}-${index}`} className="status-timeline-item">
                    <div className="status-timeline-head">
                      <span className={`status-badge ${getStatusClass(entry.status)}`}>
                        {entry.status}
                      </span>
                      <time>{formatTimestamp(entry.updatedAt)}</time>
                    </div>
                    {entry.detail ? (
                      <div className="status-timeline-detail-block">
                        <span className="status-timeline-label">ความเห็นเจ้าหน้าที่</span>
                        <p className="status-timeline-detail">{entry.detail}</p>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <p className="result-note">
            ระบบแสดงสถานะและความเห็นเจ้าหน้าที่ — ไม่แสดงข้อมูลส่วนตัวหรือหลักฐาน
          </p>
        </div>
      )}
    </div>
  );
}
