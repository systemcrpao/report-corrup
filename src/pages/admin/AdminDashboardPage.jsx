import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllComplaints } from "../../services/adminService.js";
import { buildComplaintStats, toDate, formatThaiDateTime } from "../../utils/statsUtils.js";
import { getAvailableYears, filterComplaintsByYear } from "../../utils/yearFilter.js";
import SummaryCards from "../../components/admin/SummaryCards.jsx";
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
  const [selectedYear, setSelectedYear] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllComplaints();
        setComplaints(data);
        const years = getAvailableYears(data);
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const yearOptions = useMemo(() => getAvailableYears(complaints), [complaints]);

  const filteredComplaints = useMemo(
    () => filterComplaintsByYear(complaints, selectedYear),
    [complaints, selectedYear]
  );

  const stats = useMemo(() => buildComplaintStats(filteredComplaints), [filteredComplaints]);
  const recent = filteredComplaints.slice(0, 5);

  if (isLoading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <section className="admin-page">
      <header className="dashboard-header">
        <div>
          <h2>ภาพรวมระบบ</h2>
          <p>
            สรุปข้อมูลเรื่องร้องเรียน
            {selectedYear === "all" ? "ทั้งหมด" : `ปี พ.ศ. ${selectedYear}`}
            {" "}จำนวน {stats.total} เรื่อง
          </p>
        </div>

        <div className="year-filter">
          <label htmlFor="dashboardYear">เลือกปี (พ.ศ.)</label>
          <select
            id="dashboardYear"
            value={selectedYear}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedYear(value === "all" ? "all" : Number(value));
            }}
          >
            <option value="all">ทุกปี</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                พ.ศ. {year}
              </option>
            ))}
          </select>
        </div>
      </header>

      <SummaryCards stats={stats} />

      <StatsSummary stats={stats} selectedYear={selectedYear} />

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
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    ไม่มีข้อมูลในปีที่เลือก
                  </td>
                </tr>
              ) : (
                recent.map((item) => {
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
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
