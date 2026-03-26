import React from "react";

export default function LoginIntro() {
  return (
    <>
      <style>{`
        .nbn-login-intro {
          margin: 0 0 20px;
        }

        .nbn-login-intro__panel {
          background: linear-gradient(135deg, rgba(200, 16, 46, 0.06) 0%, rgba(255, 255, 255, 0.96) 100%);
          border: 1px solid rgba(200, 16, 46, 0.14);
          border-radius: 24px;
          padding: 24px 24px 20px;
          box-shadow: 0 22px 54px rgba(200, 16, 46, 0.10);
        }

        .nbn-login-intro__eyebrow {
          margin: 0 0 10px;
          color: #C8102E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .nbn-login-intro h1 {
          margin: 0;
          color: #111827;
          font-size: 34px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .nbn-login-intro__subtitle {
          margin: 12px 0 0;
          color: #374151;
          font-size: 15px;
          line-height: 1.7;
          font-weight: 500;
        }

        .nbn-login-intro__meta {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          color: #6b7280;
          font-size: 12px;
          font-weight: 600;
        }

        .nbn-login-intro__pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid rgba(200, 16, 46, 0.10);
          color: #4b5563;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
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
