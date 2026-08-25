import Link from "next/link";

export default function NavBar() {
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <div className="brand-mark">SO</div>
        <div>
          <div className="brand-name">SchoolOS</div>
          <div className="small-text">Smart School Dashboard</div>
        </div>
      </div>

      <nav className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/teacher">Teacher</Link>
        <Link href="/student">Student</Link>
        <Link href="/guardian">Guardian</Link>
        <Link href="/attendance">Attendance</Link>
        <Link href="/results">Results</Link>
        <Link href="/notices">Notices</Link>
        <Link href="/ai">AI Tutor</Link>
      </nav>
    </header>
  );
}
