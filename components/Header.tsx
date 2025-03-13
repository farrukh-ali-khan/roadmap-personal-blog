// components/Header.tsx

import { useRouter } from "next/router";
import React from "react";

interface HeaderProps {
  isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
  const router = useRouter();

  return (
    <header className={isAdmin ? "admin-header" : "site-header"}>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className="site-title"
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
        >
          My Personal Blog
        </div>
        <div className="nav-links">
          {isAdmin ? (
            <>
              <button onClick={() => router.push("/")}>Home</button>
              <button onClick={() => router.push("/api/auth/logout")}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => router.push("/admin/login")}>Login</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
