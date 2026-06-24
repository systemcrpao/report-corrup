import { Outlet, NavLink } from "react-router-dom";
import logoUrl from "../logo.png";
import { IconHome, IconSubmit, IconStaff, IconTrack } from "./NavIcons.jsx";

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand">
            <img
              src={logoUrl}
              alt="ตราอบจ.เชียงราย"
              className="brand-logo"
              width={72}
              height={72}
            />
            <div>
              <p className="brand-kicker">
                ระบบร้องเรียนการทุจริต ประพฤติมิชอบ การละเว้นการปฏิบัติหน้าที่
              </p>
              <h1 className="brand-title">องค์การบริหารส่วนจังหวัดเชียงราย</h1>
            </div>
          </NavLink>
          <nav className="main-nav" aria-label="เมนูหลัก">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <IconHome />
              หน้าแรก
            </NavLink>
            <NavLink to="/submit" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <IconSubmit />
              แจ้งเรื่องร้องเรียน
            </NavLink>
            <NavLink to="/track" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <IconTrack />
              ติดตามสถานะ
            </NavLink>
            <NavLink
              to="/admin/login"
              className={({ isActive }) => (isActive ? "nav-link nav-link-staff active" : "nav-link nav-link-staff")}
            >
              <IconStaff />
              เจ้าหน้าที่
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>องค์การบริหารส่วนจังหวัดเชียงราย — ระบบรับเรื่องร้องเรียนอย่างปลอดภัยและเป็นความลับ</p>
        </div>
      </footer>
    </div>
  );
}
