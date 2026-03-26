import React from "react";

export default function LoginIntro() {
  return (
    <>
      <style>{`
        @keyframes nbnFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes nbnSoftFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes nbnGlowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200, 16, 46, 0.00); }
          50% { box-shadow: 0 0 0 12px rgba(200, 16, 46, 0.05); }
        }

        @keyframes nbnShimmer {
          0% { transform: translateX(-110%); opacity: 0; }
          35% { opacity: 0.55; }
          100% { transform: translateX(130%); opacity: 0; }
        }

        body {
          background:
            radial-gradient(circle at top, rgba(200, 16, 46, 0.18) 0%, rgba(200, 16, 46, 0.05) 24%, rgba(255,255,255,0) 48%),
            linear-gradient(180deg, #fffefe 0%, #fff6f7 100%) !important;
        }

        .nbn-login-intro {
          margin: 0 0 18px;
          animation: nbnFadeUp 0.7s ease-out both;
        }

        .nbn-login-intro__panel {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,247,248,0.98) 100%);
          border: 1px solid rgba(200, 16, 46, 0.14);
          border-radius: 28px;
          padding: 28px 28px 24px;
          box-shadow: 0 28px 80px rgba(17, 24, 39, 0.08), 0 12px 36px rgba(200, 16, 46, 0.08);
          animation: nbnSoftFloat 5s ease-in-out infinite, nbnGlowPulse 4.2s ease-in-out infinite;
        }

        .nbn-login-intro__panel::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.72) 48%, transparent 100%);
          transform: translateX(-110%);
          animation: nbnShimmer 4.6s ease-in-out infinite;
          pointer-events: none;
        }

        .nbn-login-intro__eyebrow {
          margin: 0 0 10px;
          color: #C8102E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .nbn-login-intro h1 {
          margin: 0;
          color: #111827;
          font-size: 38px;
          line-height: 1.08;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .nbn-login-intro__subtitle {
          margin: 14px 0 0;
          color: #374151;
          font-size: 16px;
          line-height: 1.75;
          font-weight: 500;
          max-width: 560px;
        }

        .nbn-login-intro__meta {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          color: #6b7280;
          font-size: 12px;
          font-weight: 600;
        }

        .nbn-login-intro__pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid rgba(200, 16, 46, 0.10);
          color: #4b5563;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }

        .nbn-login-intro__pill:hover {
          transform: translateY(-2px);
          border-color: rgba(200, 16, 46, 0.22);
          box-shadow: 0 16px 28px rgba(200, 16, 46, 0.10);
        }

        form {
          background: rgba(255, 255, 255, 0.98) !important;
          border: 1px solid rgba(200, 16, 46, 0.12) !important;
          border-radius: 28px !important;
          padding: 26px 26px 28px !important;
          box-shadow: 0 32px 80px rgba(17, 24, 39, 0.10), 0 14px 34px rgba(200, 16, 46, 0.08) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          animation: nbnFadeUp 0.85s ease-out both;
        }

        form label {
          color: #374151 !important;
          font-weight: 700 !important;
        }

        form input {
          min-height: 56px !important;
          border-radius: 16px !important;
          border: 1px solid #ead0d5 !important;
          background: #ffffff !important;
          box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.03);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease !important;
        }

        form input:hover {
          border-color: rgba(200, 16, 46, 0.25) !important;
        }

        form input:focus {
          transform: translateY(-1px);
          border-color: #C8102E !important;
          box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.12) !important;
        }

        form button,
        form [type="submit"] {
          min-height: 54px !important;
          border-radius: 16px !important;
          border: none !important;
          background: linear-gradient(135deg, #C8102E 0%, #A50D26 100%) !important;
          color: #ffffff !important;
          font-weight: 800 !important;
          letter-spacing: 0.02em;
          box-shadow: 0 18px 32px rgba(200, 16, 46, 0.22) !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease !important;
        }

        form button:hover,
        form [type="submit"]:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 24px 36px rgba(200, 16, 46, 0.28) !important;
          filter: saturate(1.06);
        }

        form a {
          color: #C8102E !important;
          font-weight: 700 !important;
          transition: opacity 0.18s ease;
        }

        form a:hover {
          opacity: 0.82;
        }

        @media (prefers-reduced-motion: reduce) {
          .nbn-login-intro,
          .nbn-login-intro__panel,
          .nbn-login-intro__panel::after,
          form {
            animation: none !important;
          }
        }

        @media (max-width: 768px) {
          .nbn-login-intro__panel {
            padding: 22px 20px 18px;
            border-radius: 22px;
          }

          .nbn-login-intro h1 {
            font-size: 31px;
          }

          .nbn-login-intro__subtitle {
            font-size: 15px;
          }

          form {
            padding: 20px 18px 22px !important;
            border-radius: 22px !important;
          }
        }
      `}</style>

      <div className="nbn-login-intro">
        <div className="nbn-login-intro__panel">
          <p className="nbn-login-intro__eyebrow">Secure newsroom login</p>
          <h1>नमो: भारत न्यूज़ 24 एडमिन</h1>
          <p className="nbn-login-intro__subtitle">
            अधिकृत संपादकीय टीम के लिए सुरक्षित प्रवेश। खबरें, मीडिया, श्रेणियाँ और प्रकाशन यहीं से नियंत्रित करें।
          </p>
          <div className="nbn-login-intro__meta">
            <span className="nbn-login-intro__pill">Payload CMS</span>
            <span className="nbn-login-intro__pill">Authorized team only</span>
            <span className="nbn-login-intro__pill">तथ्य स्पष्ट, विचार निष्पक्ष।</span>
          </div>
        </div>
      </div>
    </>
  );
}
