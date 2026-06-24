function StatTable({ title, rows, labelFormatter, emptyText = "ยังไม่มีข้อมูล" }) {
  if (rows.length === 0) {
    return (
      <article className="stat-card stat-card-v2">
        <h3>{title}</h3>
        <p className="empty-text">{emptyText}</p>
      </article>
    );
  }

  const max = Math.max(...rows.map(([, count]) => count));

  return (
    <article className="stat-card stat-card-v2">
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

export default function StatsSummary({ stats, selectedYear }) {
  const gregorianYear = selectedYear === "all" ? null : selectedYear - 543;

  const monthlyRows =
    selectedYear === "all"
      ? stats.monthly
      : stats.monthly.filter(([key]) => key.startsWith(`${gregorianYear}-`));

  const quarterlyRows =
    selectedYear === "all"
      ? stats.quarterly
      : stats.quarterly.filter(([key]) => key.startsWith(`${gregorianYear}-`));

  return (
    <div className="stats-grid">
      <StatTable
        title={selectedYear === "all" ? "สรุปรายเดือน" : `สรุปรายเดือน พ.ศ. ${selectedYear}`}
        rows={monthlyRows}
        emptyText="ไม่มีข้อมูลรายเดือนในปีที่เลือก"
        labelFormatter={(key) => {
          const [year, month] = key.split("-");
          const date = new Date(Number(year), Number(month) - 1, 1);
          return date.toLocaleDateString("th-TH", { year: "numeric", month: "long" });
        }}
      />
      <StatTable
        title={selectedYear === "all" ? "สรุปรายไตรมาส" : `สรุปรายไตรมาส พ.ศ. ${selectedYear}`}
        rows={quarterlyRows}
        emptyText="ไม่มีข้อมูลรายไตรมาสในปีที่เลือก"
        labelFormatter={(key) => {
          const [year, quarter] = key.split("-Q");
          return `ไตรมาสที่ ${quarter} ปี ${Number(year) + 543}`;
        }}
      />
      <StatTable title="แยกตามสถานะ" rows={stats.byStatus} />
      <StatTable title="แยกตามประเภทเรื่อง" rows={stats.byCategory} />
      <StatTable title="แยกตามอำเภอ" rows={stats.byDistrict.slice(0, 8)} />
      {selectedYear !== "all" && (
        <StatTable
          title="สรุปรายปี"
          rows={[[String(selectedYear), stats.total]]}
          emptyText="ไม่มีข้อมูล"
        />
      )}
    </div>
  );
}
