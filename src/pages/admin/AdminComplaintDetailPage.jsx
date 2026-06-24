import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { updateComplaint } from "../../services/adminService.js";
import { resolveEvidenceUrls } from "../../services/evidenceService.js";
import { toDate, formatThaiDateTime } from "../../utils/statsUtils.js";
import { COMPLAINT_STATUS_OPTIONS } from "../../types/complaint.js";

export default function AdminComplaintDetailPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [evidenceLinks, setEvidenceLinks] = useState([]);
  const [evidenceError, setEvidenceError] = useState("");

  useEffect(() => {
    async function loadComplaint() {
      try {
        const snapshot = await getDoc(doc(db, "complaints", id));
        if (!snapshot.exists()) {
          setError("ไม่พบเรื่องร้องเรียนนี้");
          return;
        }

        const data = { id: snapshot.id, ...snapshot.data() };
        setComplaint(data);
        setStatus(data.status ?? "");
        setAdminNotes(data.adminNotes ?? "");

        if (data.evidenceUrls?.length) {
          try {
            const links = await resolveEvidenceUrls(data.evidenceUrls);
            setEvidenceLinks(links);
          } catch (evidenceErr) {
            console.error(evidenceErr);
            setEvidenceError("ไม่สามารถโหลดลิงก์หลักฐานได้ กรุณาตรวจสอบสิทธิ์ Storage");
          }
        }
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดรายละเอียดได้");
      } finally {
        setIsLoading(false);
      }
    }

    loadComplaint();
  }, [id]);

  async function handleSave(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      await updateComplaint(id, { status, adminNotes: adminNotes.trim() });
      setMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
      setComplaint((prev) => ({ ...prev, status, adminNotes: adminNotes.trim() }));
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error && !complaint) {
    return (
      <section className="admin-page">
        <div className="alert alert-error">{error}</div>
        <Link to="/admin/complaints" className="btn btn-secondary">
          กลับ
        </Link>
      </section>
    );
  }

  const created = toDate(complaint.createdAt);
  const updated = toDate(complaint.updatedAt);

  return (
    <section className="admin-page">
      <header className="section-header-inline">
        <div>
          <h2>รายละเอียดเรื่องร้องเรียน</h2>
          <p>{complaint.trackingId}</p>
        </div>
        <Link to="/admin/complaints" className="btn btn-secondary">
          กลับรายการ
        </Link>
      </header>

      <div className="detail-grid">
        <article className="detail-card">
          <h3>ข้อมูลเรื่องร้องเรียน</h3>
          <dl className="detail-list">
            <div>
              <dt>ประเภท</dt>
              <dd>{complaint.category}</dd>
            </div>
            <div>
              <dt>รายละเอียดการทุจริต</dt>
              <dd className="detail-text">{complaint.details}</dd>
            </div>
            <div>
              <dt>สถานที่เกิดเหตุ</dt>
              <dd>
                {complaint.location?.address ?? "-"}
                <br />
                ต.{complaint.location?.subDistrict ?? "-"} อ.{complaint.location?.district ?? "-"}{" "}
                จ.{complaint.location?.province ?? "เชียงราย"}
              </dd>
            </div>
            <div>
              <dt>วันที่แจ้ง</dt>
              <dd>{created ? formatThaiDateTime(created) : "-"}</dd>
            </div>
            <div>
              <dt>อัปเดตล่าสุด</dt>
              <dd>{updated ? formatThaiDateTime(updated) : "-"}</dd>
            </div>
          </dl>
        </article>

        <article className="detail-card">
          <h3>ข้อมูลผู้แจ้ง</h3>
          <dl className="detail-list">
            <div>
              <dt>ชื่อ-นามสกุล</dt>
              <dd>{complaint.informantName || "ไม่เปิดเผยตัวตน"}</dd>
            </div>
            <div>
              <dt>ช่องทางติดต่อ</dt>
              <dd>{complaint.informantContact || "-"}</dd>
            </div>
          </dl>
        </article>

        <article className="detail-card">
          <h3>หลักฐานประกอบ</h3>
          {complaint.evidenceUrls?.length ? (
            <>
              {evidenceError && (
                <div className="alert alert-warning">{evidenceError}</div>
              )}
              <ul className="evidence-list">
                {evidenceLinks.map((url, index) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noreferrer">
                      เปิดไฟล์หลักฐาน {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="empty-text">ไม่มีไฟล์แนบ</p>
          )}
        </article>

        <article className="detail-card">
          <h3>จัดการสถานะ</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="status">สถานะเรื่อง</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSaving}
              >
                {COMPLAINT_STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="adminNotes">บันทึกภายใน (เจ้าหน้าที่)</label>
              <textarea
                id="adminNotes"
                rows={5}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="บันทึกการดำเนินการภายใน"
                disabled={isSaving}
              />
            </div>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
