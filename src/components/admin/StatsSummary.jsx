function StatTable({ title, rows, labelFormatter }) {
  if (rows.length === 0) {
    return (
      <article className="stat-card">
        <h3>{title}</h3>
        <p className="empty-text">ยังไม่มีข้อมูล</p>
      </article>
    );
  }

  const max = Math.max(...rows.map(([, count]) => count));

  return (
    <article className="stat-card">
      <h3>{title}</h3>
      <ul className="stat-list">
        {rows.map(([key, count]) => (
          <li key={key}>
            <div className="stat-row-head">
              <span>{labelFormatter ? labelFormatter(key) : key}</span>
              <strong>{count} เรื่อง</strong>
            </div>
            <div className="stat-bar-track">
              <div className="stat-bar-fill" style={{ width: `${(count / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function StatsSummary({ stats }) {
  return (
    <div className="stats-grid">
      <StatTable title="สรุปรายเดือน" rows={stats.monthly} labelFormatter={(key) => {
        const [year, month] = key.split("-");
        const date = new Date(Number(year), Number(month) - 1, 1);
        return date.toLocaleDateString("th-TH", { year: "numeric", month: "long" });
      }} />
      <StatTable title="สรุปรายไตรมาส" rows={stats.quarterly} labelFormatter={(key) => {
        const [year, quarter] = key.split("-Q");
        return `ไตรมาสที่ ${quarter} ปี ${Number(year) + 543}`;
      }} />
      <StatTable title="สรุปรายปี (พ.ศ.)" rows={stats.yearly} />
      <StatTable title="แยกตามสถานะ" rows={stats.byStatus} />
      <StatTable title="แยกตามประเภทเรื่อง" rows={stats.byCategory} />
      <StatTable title="แยกตามอำเภอ" rows={stats.byDistrict} />
    </div>
  );
}
