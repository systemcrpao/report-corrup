import { useState } from "react";
import {
  COMPLAINT_CATEGORIES,
  MAX_FILE_SIZE_MB,
  ALLOWED_FILE_TYPES,
} from "../types/complaint.js";
import { submitComplaint } from "../services/complaintService.js";
import LocationSelector from "./LocationSelector.jsx";
import {
  checkRateLimit,
  recordSubmission,
  formatRetryAfter,
} from "../utils/rateLimit.js";

const MAX_FILES = 5;

export default function ComplaintForm({ onSubmitStart, onSuccess, onError, isLocked = false }) {
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [incidentAddress, setIncidentAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [informantName, setInformantName] = useState("");
  const [informantContact, setInformantContact] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(event) {
    const selected = Array.from(event.target.files ?? []);
    setError("");

    if (selected.length + files.length > MAX_FILES) {
      setError(`แนบไฟล์ได้สูงสุด ${MAX_FILES} ไฟล์`);
      event.target.value = "";
      return;
    }

    for (const file of selected) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError("รองรับเฉพาะไฟล์ JPG, PNG, WEBP หรือ PDF");
        event.target.value = "";
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`ขนาดไฟล์ต้องไม่เกิน ${MAX_FILE_SIZE_MB} MB ต่อไฟล์`);
        event.target.value = "";
        return;
      }
    }

    setFiles((prev) => [...prev, ...selected]);
    event.target.value = "";
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!category) {
      setError("กรุณาเลือกประเภทเรื่องร้องเรียน");
      return;
    }

    if (!details.trim()) {
      setError("กรุณาระบุรายละเอียดการทุจริตหรือการกระทำผิด");
      return;
    }

    if (!incidentAddress.trim()) {
      setError("กรุณาระบุสถานที่เกิดเหตุ");
      return;
    }

    if (!district) {
      setError("กรุณาเลือกอำเภอ");
      return;
    }

    if (!subDistrict) {
      setError("กรุณาเลือกตำบล");
      return;
    }

    if (!isAnonymous) {
      if (!informantName.trim()) {
        setError("กรุณาระบุชื่อ-นามสกุล หรือเลือกแจ้งแบบไม่เปิดเผยตัวตน");
        return;
      }
      if (!informantContact.trim()) {
        setError("กรุณาระบุอีเมลหรือเบอร์โทรติดต่อ");
        return;
      }
    }

    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setError(
        `คุณส่งเรื่องร้องเรียนเกินจำนวนที่กำหนดแล้ว กรุณารอ ${formatRetryAfter(rateCheck.retryAfterMs)} ก่อนส่งใหม่`
      );
      return;
    }

    setIsLoading(true);
    onSubmitStart?.();

    try {
      const newTrackingId = await submitComplaint({
        category,
        details,
        location: {
          address: incidentAddress,
          district,
          subDistrict,
        },
        informantName,
        informantContact,
        isAnonymous,
        files,
      });

      recordSubmission();
      setCategory("");
      setDetails("");
      setIncidentAddress("");
      setDistrict("");
      setSubDistrict("");
      setInformantName("");
      setInformantContact("");
      setIsAnonymous(false);
      setFiles([]);
      onSuccess(newTrackingId);
    } catch (err) {
      console.error(err);
      onError?.();
      const code = err?.code ?? "";

      if (code === "storage/unauthorized" || code === "storage/permission-denied") {
        setError("ไม่สามารถอัปโหลดไฟล์ได้ กรุณาตรวจสอบ Firebase Storage Rules");
      } else if (code === "permission-denied") {
        setError("ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบ Firestore Rules");
      } else {
        setError("ไม่สามารถส่งเรื่องร้องเรียนได้ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="category">ประเภทเรื่องร้องเรียน *</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isLoading || isLocked}
          required
        >
          <option value="">-- เลือกประเภท --</option>
          {COMPLAINT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="details">รายละเอียดการทุจริต / การกระทำผิด *</label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={6}
          placeholder="อธิบายพฤติการณ์ วันเวลา บุคคลที่เกี่ยวข้อง และรายละเอียดการทุจริต"
          disabled={isLoading || isLocked}
          required
        />
      </div>

      <LocationSelector
        address={incidentAddress}
        district={district}
        subDistrict={subDistrict}
        onAddressChange={setIncidentAddress}
        onDistrictChange={setDistrict}
        onSubDistrictChange={setSubDistrict}
        disabled={isLoading}
      />

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={isLoading || isLocked}
          />
          แจ้งเรื่องแบบไม่เปิดเผยตัวตน (Anonymous)
        </label>
      </div>

      {!isAnonymous && (
        <>
          <div className="form-group">
            <label htmlFor="informantName">ชื่อ-นามสกุล *</label>
            <input
              id="informantName"
              type="text"
              value={informantName}
              onChange={(e) => setInformantName(e.target.value)}
              placeholder="ชื่อ-นามสกุลผู้แจ้ง"
              disabled={isLoading || isLocked}
            />
          </div>

          <div className="form-group">
            <label htmlFor="informantContact">อีเมลหรือเบอร์โทรติดต่อ *</label>
            <input
              id="informantContact"
              type="text"
              value={informantContact}
              onChange={(e) => setInformantContact(e.target.value)}
              placeholder="example@email.com หรือ 08x-xxx-xxxx"
              disabled={isLoading || isLocked}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="evidence">แนบหลักฐาน (ไม่บังคับ)</label>
        <input
          id="evidence"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          multiple
          onChange={handleFileChange}
          disabled={isLoading || files.length >= MAX_FILES}
        />
        <p className="field-hint">
          รองรับ JPG, PNG, WEBP, PDF สูงสุด {MAX_FILE_SIZE_MB} MB ต่อไฟล์ (ไม่เกิน {MAX_FILES} ไฟล์)
        </p>

        {files.length > 0 && (
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                <span>{file.name}</span>
                <button
                  type="button"
                  className="btn-text"
                  onClick={() => removeFile(index)}
                  disabled={isLoading || isLocked}
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-block" disabled={isLoading || isLocked}>
        {isLoading ? "กำลังส่งเรื่อง..." : "ส่งเรื่องร้องเรียน"}
      </button>
    </form>
  );
}
