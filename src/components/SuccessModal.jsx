import { useState } from "react";

export default function SuccessModal({ trackingId, onClose }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="success-title">
      <div className="modal-card">
        <h3 id="success-title">ส่งเรื่องร้องเรียนสำเร็จ</h3>
        <p>กรุณาบันทึกรหัสอ้างอิงด้านล่างเพื่อใช้ติดตามสถานะ</p>

        <div className="tracking-id-box">
          <code>{trackingId}</code>
          <button type="button" className="btn btn-secondary" onClick={handleCopy}>
            {copied ? "คัดลอกแล้ว" : "คัดลอก"}
          </button>
        </div>

        <p className="modal-warning">
          ระบบจะไม่แสดงรหัสนี้อีกครั้ง หากทำรหัสหายจะไม่สามารถติดตามสถานะได้
        </p>

        <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  );
}
