import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { getAuthErrorMessage } from "../../services/authService.js";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAdmin, isLoading: authLoading } = useAuth();

  const redirectTo = location.state?.from ?? "/admin";

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate(redirectTo, { replace: true });
    }
  }, [authLoading, isAdmin, navigate, redirectTo]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const code = err?.code ?? "UNKNOWN";
      setError(getAuthErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="admin-login-shell">
        <div className="admin-login-loading">กำลังตรวจสอบสถานะ...</div>
      </div>
    );
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-brand">
        <div className="admin-login-brand-inner">
          <span className="admin-login-badge">อบจ.เชียงราย</span>
          <h1>ระบบบริหารจัดการเรื่องร้องเรียนการทุจริต ประพฤติมิชอบ การละเว้นการปฏิบัติหน้าที่ของเจ้าหน้าที่</h1>
          <p>แพลตฟอร์มสำหรับเจ้าหน้าที่ตรวจสอบ ติดตาม และสรุปรายงานเรื่องร้องเรียนการทุจริต</p>
          <ul className="admin-login-features">
            <li>ดูรายการเรื่องร้องเรียนทั้งหมด</li>
            <li>อัปเดตสถานะและบันทึกภายใน</li>
            <li>สรุปรายงานรายเดือน / ไตรมาส / ปี</li>
          </ul>
        </div>
      </div>

      <div className="admin-login-panel">
        <form className="admin-login-card" onSubmit={handleSubmit}>
          <div className="admin-login-card-header">
            <h2>เข้าสู่ระบบเจ้าหน้าที่</h2>
            <p>ใช้บัญชีที่ได้รับอนุญาตจากผู้ดูแลระบบ</p>
          </div>

          <div className="login-field">
            <label htmlFor="adminEmail">อีเมล</label>
            <div className={`login-input-wrap${email ? " has-value" : ""}`}>
              <span className="login-input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 7h16v10H4z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </span>
              <input
                id="adminEmail"
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="username"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="adminPassword">รหัสผ่าน</label>
            <div className={`login-input-wrap${password ? " has-value" : ""}`}>
              <span className="login-input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              <input
                id="adminPassword"
                className="login-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? "ซ่อน" : "แสดง"}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error admin-login-alert" role="alert">
              <strong>{error.title}</strong>
              <p>{error.detail}</p>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block admin-login-submit" disabled={isLoading}>
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <Link to="/" className="admin-login-back">
            ← กลับหน้าแรกสาธารณะ
          </Link>
        </form>
      </div>
    </div>
  );
}
