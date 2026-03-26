import React from "react";

export default function LoginIntro() {
  return (
    <>
      <style>{`
        body {
          background:
            radial-gradient(circle at top, rgba(200, 16, 46, 0.14) 0%, rgba(200, 16, 46, 0.03) 22%, rgba(255,255,255,0) 44%),
            linear-gradient(180deg, #fffefe 0%, #fff6f7 100%) !important;
        }

        .nbn-login-intro {
          margin: 0 0 18px;
        }

        .nbn-login-intro__panel {
          background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,247,248,0.98) 100%);
          border: 1px solid rgba(200, 16, 46, 0.14);
          border-radius: 28px;
          padding: 28px 28px 24px;
          box-shadow: 0 28px 80px rgba(17, 24, 39, 0.08), 0 12px 36px rgba(200, 16, 46, 0.08);
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
        }

        form {
          background: rgba(255, 255, 255, 0.98) !important;
          border: 1px solid rgba(200, 16, 46, 0.12) !important;
          border-radius: 28px !important;
          padding: 26px 26px 28px !important;
          box-shadow: 0 32px 80px rgba(17, 24, 39, 0.10), 0 14px 34px rgba(200, 16, 46, 0.08) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
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
        }

        form input:focus {
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
        }

        form a {
          color: #C8102E !important;
          font-weight: 700 !important;
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
