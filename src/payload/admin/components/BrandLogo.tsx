import React from "react";

const ADMIN_LOGO = "data:image/jpeg;base64,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";

export default function BrandLogo() {
  return (
    <div
      aria-label="Namo Bharat News 24 Admin"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        width: "min(100%, 640px)",
        margin: "0 auto 22px",
        padding: "18px 22px",
        borderRadius: 30,
        background: "linear-gradient(135deg, rgba(255,255,255,0.99) 0%, rgba(255,245,246,0.98) 100%)",
        border: "1px solid rgba(200, 16, 46, 0.16)",
        boxShadow: "0 26px 70px rgba(17, 24, 39, 0.10), 0 14px 34px rgba(200, 16, 46, 0.10)",
      }}
    >
      <img
        src={ADMIN_LOGO}
        alt="नमो: भारत न्यूज़ 24"
        style={{
          width: 106,
          height: 106,
          borderRadius: "50%",
          objectFit: "cover",
          border: "5px solid #ffffff",
          boxShadow: "0 20px 42px rgba(200, 16, 46, 0.24)",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <strong style={{ color: "#111827", fontSize: 31, lineHeight: 1.02, fontWeight: 900, letterSpacing: "-0.03em" }}>
          नमो: भारत न्यूज़ 24
        </strong>
        <span style={{ color: "#C8102E", fontSize: 14, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase" }}>
          Payload Admin
        </span>
        <span style={{ color: "#4b5563", fontSize: 16, fontWeight: 700 }}>
          तथ्य स्पष्ट, विचार निष्पक्ष।
        </span>
      </div>
    </div>
  );
}
