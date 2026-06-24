import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllComplaints } from "../../services/adminService.js";
import { toDate, formatThaiDateTime } from "../../utils/statsUtils.js";
import { COMPLAINT_STATUS_OPTIONS } from "../../types/complaint.js";
import { printComplaintReport } from "../../utils/complaintReport.js";

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

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllComplaints();
        setComplaints(data);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดรายการเรื่องร้องเรียนได้");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const districts = useMemo(() => {
    const set = new Set(
      complaints.map((item) => item.location?.district).filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b, "th"));
  }, [complaints]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return complaints.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (districtFilter && item.location?.district !== districtFilter) return false;

      if (!keyword) return true;

      return [
        item.trackingId,
        item.category,
        item.details,
        item.location?.address,
        item.location?.district,
        item.location?.subDistrict,
        item.informantName,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [complaints, search, statusFilter, districtFilter]);

  function handlePrintReport(item) {
    try {
      printComplaintReport(item);
    } catch (err) {
      if (err?.message === "POPUP_BLOCKED") {
        setError("เบราว์เซอร์บล็อกหน้าต่างพิมพ์ กรุณาอนุญาต popup แล้วลองใหม่");
      } else {
        setError("ไม่สามารถสร้างรายงานได้");
      }
    }
  }

  if (isLoading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <section className="admin-page">
      <header className="section-header">
        <h2>รายการเรื่องร้องเรียน</h2>
        <p>ทั้งหมด {filtered.length} เรื่อง</p>
      </header>

      <div className="filter-bar">
        <input
          type="search"
          placeholder="ค้นหารหัส รายละเอียด อำเภอ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">ทุกสถานะ</option>
          {COMPLAINT_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}>
          <option value="">ทุกอำเภอ</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ประเภท</th>
              <th>สถานที่</th>
              <th>สถานะ</th>
              <th>วันที่แจ้ง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const created = toDate(item.createdAt);
                return (
                  <tr key={item.id}>
                    <td>{item.trackingId}</td>
                    <td>{item.category}</td>
                    <td>
                      {item.location?.subDistrict ?? "-"} / {item.location?.district ?? "-"}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{created ? formatThaiDateTime(created) : "-"}</td>
                    <td className="action-cell">
                      <Link to={`/admin/complaints/${item.id}`} className="btn btn-secondary btn-sm">
                        ดูรายละเอียด
                      </Link>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handlePrintReport(item)}
                      >
                        รายงาน
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
