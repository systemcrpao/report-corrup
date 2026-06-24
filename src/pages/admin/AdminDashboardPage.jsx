import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllComplaints } from "../../services/adminService.js";
import { buildComplaintStats, toDate, formatThaiDateTime } from "../../utils/statsUtils.js";
import StatsSummary from "../../components/admin/StatsSummary.jsx";

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

export default function AdminDashboardPage() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllComplaints();
        setComplaints(data);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  const stats = buildComplaintStats(complaints);
  const recent = complaints.slice(0, 5);

  return (
    <section className="admin-page">
      <header className="section-header">
        <h2>ภาพรวมระบบ</h2>
        <p>สรุปข้อมูลเรื่องร้องเรียนทั้งหมด {stats.total} เรื่อง</p>
      </header>

      <div className="summary-cards">
        <article className="summary-card">
          <span>ทั้งหมด</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="summary-card">
          <span>รอดำเนินการ</span>
          <strong>{stats.byStatus.find(([s]) => s === "รอดำเนินการ")?.[1] ?? 0}</strong>
        </article>
        <article className="summary-card">
          <span>กำลังตรวจสอบ</span>
          <strong>{stats.byStatus.find(([s]) => s === "กำลังตรวจสอบ")?.[1] ?? 0}</strong>
        </article>
        <article className="summary-card">
          <span>ยุติเรื่อง</span>
          <strong>{stats.byStatus.find(([s]) => s === "ยุติเรื่อง")?.[1] ?? 0}</strong>
        </article>
      </div>

      <StatsSummary stats={stats} />

      <section className="admin-section">
        <div className="section-header-inline">
          <h3>เรื่องร้องเรียนล่าสุด</h3>
          <Link to="/admin/complaints" className="btn btn-secondary">
            ดูทั้งหมด
          </Link>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ประเภท</th>
                <th>อำเภอ</th>
                <th>สถานะ</th>
                <th>วันที่แจ้ง</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => {
                const created = toDate(item.createdAt);
                return (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/admin/complaints/${item.id}`}>{item.trackingId}</Link>
                    </td>
                    <td>{item.category}</td>
                    <td>{item.location?.district ?? "-"}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{created ? formatThaiDateTime(created) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
