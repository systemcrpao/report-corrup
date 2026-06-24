const STATUS_META = {
  total: {
    label: "เรื่องร้องเรียนทั้งหมด",
    hint: "จำนวนเรื่องในปีที่เลือก",
    tone: "total",
    icon: "📋",
  },
  "รอดำเนินการ": {
    label: "รอดำเนินการ",
    hint: "ยังไม่เริ่มตรวจสอบ",
    tone: "pending",
    icon: "⏳",
  },
  "กำลังตรวจสอบ": {
    label: "กำลังตรวจสอบ",
    hint: "อยู่ระหว่างดำเนินการ",
    tone: "progress",
    icon: "🔍",
  },
  "ยุติเรื่อง": {
    label: "ยุติเรื่อง",
    hint: "ดำเนินการเสร็จสิ้น",
    tone: "closed",
    icon: "✅",
  },
};

function getPercent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export default function SummaryCards({ stats }) {
  const pending = stats.byStatus.find(([s]) => s === "รอดำเนินการ")?.[1] ?? 0;
  const progress = stats.byStatus.find(([s]) => s === "กำลังตรวจสอบ")?.[1] ?? 0;
  const closed = stats.byStatus.find(([s]) => s === "ยุติเรื่อง")?.[1] ?? 0;

  const cards = [
    { key: "total", value: stats.total },
    { key: "รอดำเนินการ", value: pending },
    { key: "กำลังตรวจสอบ", value: progress },
    { key: "ยุติเรื่อง", value: closed },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => {
        const meta = STATUS_META[card.key];
        const percent = card.key === "total" ? 100 : getPercent(card.value, stats.total);

        return (
          <article key={card.key} className={`summary-card-v2 tone-${meta.tone}`}>
            <div className="summary-card-top">
              <span className="summary-card-icon" aria-hidden="true">
                {meta.icon}
              </span>
              <span className="summary-card-percent">{percent}%</span>
            </div>
            <strong className="summary-card-value">{card.value}</strong>
            <span className="summary-card-label">{meta.label}</span>
            <span className="summary-card-hint">{meta.hint}</span>
            {card.key !== "total" && (
              <div className="summary-card-bar">
                <span style={{ width: `${percent}%` }} />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
