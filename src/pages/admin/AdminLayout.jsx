import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { IconDashboard, IconList } from "../../components/NavIcons.jsx";
import { getSessionRemainingMs } from "../../utils/sessionManager.js";

function formatRemaining(ms) {
  if (ms == null) return "";
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `เหลือ ${minutes} นาที`;
  return `เหลือ ${hours} ชม. ${minutes} นาที`;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sessionLabel, setSessionLabel] = useState("");

  useEffect(() => {
    function refreshSessionLabel() {
      setSessionLabel(formatRemaining(getSessionRemainingMs()));
    }

    refreshSessionLabel();
    const timer = setInterval(refreshSessionLabel, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div>
            <p className="admin-kicker">ระบบบริหารจัดการเรื่องร้องเรียน — อบจ.เชียงราย</p>
            <h1>แผงควบคุมเจ้าหน้าที่</h1>
          </div>
          <div className="admin-header-actions">
            {sessionLabel ? (
              <span className="admin-session-note" title="Session หมดอายุอัตโนมัติหลัง 6 ชั่วโมง">
                {sessionLabel}
              </span>
            ) : null}
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
            <IconDashboard />
            ภาพรวม
          </NavLink>
          <NavLink to="/admin/complaints" className={({ isActive }) => (isActive ? "active" : "")}>
            <IconList />
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
