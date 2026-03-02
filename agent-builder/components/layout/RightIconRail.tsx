"use client";

import { Search, User, Link } from "lucide-react";
import { useState } from "react";

const ICONS = [
  { id: "search", icon: Search, title: "Search" },
  { id: "user", icon: User, title: "User" },
  { id: "link", icon: Link, title: "Link" },
] as const;

export function RightIconRail() {
  const [active, setActive] = useState<string>("search");

  return (
    <div
      style={{
        width: 48,
        height: "100%",
        background: "#FFFFFF",
        borderLeft: "1px solid #CFD8DD",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 8,
        gap: 4,
        flexShrink: 0,
      }}
    >
      {ICONS.map(({ id, icon: Icon, title }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            title={title}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "#E9F1FA" : "none",
              border: isActive ? "1px solid #B8D4F5" : "1px solid transparent",
              cursor: "pointer",
              borderRadius: 4,
              color: isActive ? "#0067DF" : "#526069",
            }}
          >
            <Icon style={{ width: 16, height: 16 }} />
          </button>
        );
      })}
    </div>
  );
}
