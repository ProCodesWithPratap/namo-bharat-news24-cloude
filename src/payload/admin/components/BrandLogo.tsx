import React from "react";

export default function BrandLogo() {
  return (
    <div className="nbn-brand-logo" aria-label="Namo Bharat News 24">
      <div className="nbn-brand-logo__badge" aria-hidden>
        <span className="nbn-brand-logo__badge-top">NBN</span>
        <span className="nbn-brand-logo__badge-bottom">24</span>
      </div>
      <div className="nbn-brand-logo__text">
        <strong>Namo Bharat News 24 Admin</strong>
        <span>Editorial Command Center</span>
      </div>
    </div>
  );
}
