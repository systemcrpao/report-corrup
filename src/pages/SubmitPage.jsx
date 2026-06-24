import { useState } from "react";
import ComplaintForm from "../components/ComplaintForm.jsx";
import SuccessModal from "../components/SuccessModal.jsx";

export default function SubmitPage() {
  const [trackingId, setTrackingId] = useState(null);

  return (
    <section className="page-section">
      <header className="section-header">
        <h2>แบบฟอร์มแจ้งเรื่องร้องเรียน</h2>
        <p>กรุณากรอกรายละเอียดการทุจริตและสถานที่เกิดเหตุให้ครบถ้วน</p>
      </header>

      <ComplaintForm onSuccess={setTrackingId} />

      {trackingId && (
        <SuccessModal
          trackingId={trackingId}
          onClose={() => setTrackingId(null)}
        />
      )}
    </section>
  );
}
