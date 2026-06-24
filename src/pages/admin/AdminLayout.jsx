import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../services/authService.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div>
            <p className="admin-kicker">ระบบบริหารจัดการ</p>
            <h1>แผงควบคุมเจ้าหน้าที่</h1>
          </div>
          <div className="admin-header-actions">
            <span className="admin-user">{user?.email}</span>
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <div className="container admin-body">
        <nav className="admin-nav" aria-label="เมนูเจ้าหน้าที่">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
            ภาพรวม
          </NavLink>
          <NavLink to="/admin/complaints" className={({ isActive }) => (isActive ? "active" : "")}>
            รายการเรื่องร้องเรียน
          </NavLink>
        </nav>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
