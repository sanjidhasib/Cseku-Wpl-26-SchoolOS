"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, getToken, clearAuth } from "../lib/auth";

interface NavItem { href: string; label: string; roles: string[] }

const ALL_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", roles: ["admin"] },
  { href: "/admin/students", label: "Students", roles: ["admin"] },
  { href: "/admin/teachers", label: "Teachers", roles: ["admin"] },
  { href: "/attendance", label: "Attendance", roles: ["admin", "teacher"] },
  { href: "/results", label: "Results", roles: ["admin", "teacher", "student"] },
  { href: "/notices", label: "Notices", roles: ["admin", "teacher", "student", "guardian"] },
  { href: "/teacher", label: "Dashboard", roles: ["teacher"] },
  { href: "/student", label: "Dashboard", roles: ["student"] },
  { href: "/guardian", label: "Dashboard", roles: ["guardian"] },
  { href: "/ai", label: "AI Tutor", roles: ["teacher", "student"] },
];

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [open, setOpen] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setUser(getUser());
    setPathname(window.location.pathname);
  }, []);

  function logout() {
    clearAuth();
    router.push("/login");
  }

  const role = user?.role || "";
  const navItems = ALL_NAV.filter((n) => n.roles.includes(role));

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
  const initials = user?.email?.slice(0, 2).toUpperCase() || "?";

  return (
    <header className="topbar">
      <Link href={role ? `/${role === "admin" ? "admin" : role}` : "/"} className="brand-wrap" style={{ textDecoration: "none" }}>
        <div className="brand-mark">SO</div>
        <div>
          <div className="brand-name">SchoolOS</div>
          <div className="brand-sub">Smart Campus Management</div>
        </div>
      </Link>

      <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        <span style={open ? { transform: "translateY(7px) rotate(45deg)" } : {}} />
        <span style={open ? { opacity: 0 } : {}} />
        <span style={open ? { transform: "translateY(-7px) rotate(-45deg)" } : {}} />
      </button>

      <nav className={`nav-links${open ? " open" : ""}`}>
        {navItems.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}

        {getToken() ? (
          <div className="nav-user-group">
            <div className="nav-avatar" title={`${roleLabel}: ${user?.email}`}>
              {initials}
            </div>
            <button className="nav-logout-btn" onClick={logout}>
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" className="primary-btn" style={{ padding: "6px 16px", fontSize: "0.82rem" }}>
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
