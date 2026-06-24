import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <img src="/src/logo.png" alt="องค์การบริหารส่วนจังหวัดเชียงราย" className="brand-logo" width={80} height={80} />
            <div>
              <p className="brand-kicker">ระบบร้องเรียนการทุจริต ประพฤติมิชอบ การละเว้นการปฏิบัติหน้าที่ของเจ้าหน้าที่</p>
              <h1 className="brand-title">องค์การบริหารส่วนจังหวัดเชียงราย</h1>
            </div>
          </div>
          <nav className="main-nav" aria-label="เมนูหลัก">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              หน้าแรก
            </NavLink>
            <NavLink to="/submit" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              แจ้งเรื่องร้องเรียน
            </NavLink>
            <NavLink to="/track" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              ติดตามสถานะ
            </NavLink>
            <NavLink to="/admin/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
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
