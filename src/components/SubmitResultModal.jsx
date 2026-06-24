import { useEffect, useState } from "react";

const SUBMIT_STEPS = [
  "กำลังตรวจสอบข้อมูล",
  "กำลังจัดเก็บหลักฐาน",
  "กำลังบันทึกเรื่องร้องเรียน",
];

export default function SubmitResultModal({ phase, trackingId, onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (phase !== "submitting") return undefined;

    setActiveStep(0);
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < SUBMIT_STEPS.length - 1 ? prev + 1 : prev));
    }, 900);

    return () => clearInterval(timer);
  }, [phase]);

  if (!phase) return null;

  return (
    <div className="modal-overlay submit-modal-overlay" role="dialog" aria-modal="true">
      <div className={`modal-card submit-modal-card${phase === "success" ? " is-success" : ""}`}>
        {phase === "submitting" ? (
          <>
            <div className="submit-spinner" aria-hidden="true" />
            <h3>กำลังส่งเรื่องร้องเรียน</h3>
            <p className="submit-modal-lead">กรุณารอสักครู่ ระบบกำลังดำเนินการอย่างปลอดภัย</p>
            <ul className="submit-steps">
              {SUBMIT_STEPS.map((step, index) => (
                <li
                  key={step}
                  className={
                    index < activeStep
                      ? "done"
                      : index === activeStep
                        ? "active"
                        : ""
                  }
                >
                  {step}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className="submit-success-icon" aria-hidden="true">✓</div>
            <h3 id="success-title">ส่งเรื่องร้องเรียนสำเร็จ</h3>
            <p>กรุณาบันทึกรหัสอ้างอิงด้านล่างเพื่อใช้ติดตามสถานะ</p>

            <TrackingIdBox trackingId={trackingId} />

            <p className="modal-warning">
              ระบบจะไม่แสดงรหัสนี้อีกครั้ง หากทำรหัสหายจะไม่สามารถติดตามสถานะได้
            </p>

            <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
              กลับหน้าแรก
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TrackingIdBox({ trackingId }) {
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
    <div className="tracking-id-box">
      <code>{trackingId}</code>
      <button type="button" className="btn btn-secondary" onClick={handleCopy}>
        {copied ? "คัดลอกแล้ว" : "คัดลอก"}
      </button>
    </div>
  );
}
