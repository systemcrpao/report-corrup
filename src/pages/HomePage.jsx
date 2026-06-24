import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">Whistleblower & Complaint Management System</p>
        <h2>ช่องทางร้องเรียนการทุจริต การประพฤติมิชอบ และการละเว้นการปฏิบัติหน้าที่</h2>
        <p className="hero-lead">
          ประชาชนสามารถแจ้งเรื่องร้องเรียนได้อย่างปลอดภัย รองรับการแจ้งแบบไม่เปิดเผยตัวตน
          และติดตามสถานะด้วยรหัสอ้างอิงที่ได้รับหลังส่งเรื่อง
        </p>
        <div className="hero-actions">
          <Link to="/submit" className="btn btn-primary">
            เริ่มแจ้งเรื่องร้องเรียน
          </Link>
          <Link to="/track" className="btn btn-secondary">
            ติดตามสถานะเรื่องร้องเรียน
          </Link>
        </div>
      </div>

      <article className="privacy-banner">
        <div className="privacy-banner-icon" aria-hidden="true">🔒</div>
        <div>
          <h3>การเก็บรักษาข้อมูลผู้แจ้งเป็นความลับ</h3>
          <p>
            องค์การบริหารส่วนจังหวัดเชียงราย ให้ความสำคัญกับการคุ้มครองข้อมูลผู้แจ้งเป็นพิเศษ
            ข้อมูลส่วนบุคคลจะถูกจัดเก็บในระบบที่มีมาตรการรักษาความปลอดภัย
            และเข้าถึงได้เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น
          </p>
          <ul className="privacy-points">
            <li>เลือกแจ้งแบบไม่เปิดเผยตัวตน (Anonymous) ได้ โดยไม่บังคับกรอกชื่อและช่องทางติดต่อ</li>
            <li>ข้อมูลเรื่องร้องเรียนและหลักฐานถูกเก็บในฐานข้อมูล โดยระบบมี Security Rules ควบคุมสิทธิ์</li>
            <li>ผู้แจ้งทั่วไปติดตามได้เฉพาะสถานะเรื่อง ไม่สามารถเห็นรายละเอียดของผู้อื่น</li>
            <li>เจ้าหน้าที่มีหน้าที่รักษาความลับตามระเบียบของหน่วยงาน</li>
          </ul>
        </div>
      </article>

      <div className="info-grid">
        <article className="info-card">
          <h3>ความเป็นส่วนตัว</h3>
          <p>เลือกแจ้งแบบไม่เปิดเผยชื่อและข้อมูลติดต่อได้ ระบบจัดเก็บข้อมูลอย่างปลอดภัย</p>
        </article>
        <article className="info-card">
          <h3>แนบหลักฐาน</h3>
          <p>สามารถแนบไฟล์ภาพหรือ PDF เป็นหลักฐานประกอบเรื่องร้องเรียน (ไม่บังคับ)</p>
        </article>
        <article className="info-card">
          <h3>ติดตามสถานะ</h3>
          <p>ใช้รหัสอ้างอิง (Tracking ID) เพื่อตรวจสอบสถานะการดำเนินการของเรื่องร้องเรียน</p>
        </article>
      </div>
    </section>
  );
}
