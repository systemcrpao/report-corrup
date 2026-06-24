import TrackingForm from "../components/TrackingForm.jsx";

export default function TrackPage() {
  return (
    <section className="page-section">
      <header className="section-header">
        <h2>ติดตามสถานะเรื่องร้องเรียน</h2>
        <p>กรอกรหัสอ้างอิง (Tracking ID) ที่ได้รับหลังส่งเรื่อง เช่น CR-1718192021</p>
      </header>

      <TrackingForm />
    </section>
  );
}
