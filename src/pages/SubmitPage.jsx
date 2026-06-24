import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintForm from "../components/ComplaintForm.jsx";
import SubmitResultModal from "../components/SubmitResultModal.jsx";

export default function SubmitPage() {
  const [phase, setPhase] = useState(null);
  const [trackingId, setTrackingId] = useState(null);
  const submitStartedAt = useRef(0);
  const navigate = useNavigate();

  function handleSubmitStart() {
    submitStartedAt.current = Date.now();
    setPhase("submitting");
    setTrackingId(null);
  }

  async function handleSuccess(newTrackingId) {
    const elapsed = Date.now() - submitStartedAt.current;
    const minDuration = 2400;

    if (elapsed < minDuration) {
      await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
    }

    setTrackingId(newTrackingId);
    setPhase("success");
  }

  function handleSubmitError() {
    setPhase(null);
    setTrackingId(null);
  }

  function handleClose() {
    setPhase(null);
    setTrackingId(null);
    navigate("/");
  }

  return (
    <section className="page-section">
      <header className="section-header">
        <h2>แบบฟอร์มแจ้งเรื่องร้องเรียน</h2>
        <p>กรุณากรอกรายละเอียดการทุจริตและสถานที่เกิดเหตุให้ครบถ้วน</p>
      </header>

      <ComplaintForm
        onSubmitStart={handleSubmitStart}
        onSuccess={handleSuccess}
        onError={handleSubmitError}
        isLocked={phase === "submitting"}
      />

      <SubmitResultModal phase={phase} trackingId={trackingId} onClose={handleClose} />
    </section>
  );
}
