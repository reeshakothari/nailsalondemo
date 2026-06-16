'use client';

import Script from 'next/script';

export default function ContactFormInline() {
  return (
    <>
      <iframe
        src="https://api.leadconnectorhq.com/widget/form/5jT7GTXUIMFIFJmL7bT8"
        style={{ width: '100%', height: '400px', border: 'none', borderRadius: '8px' }}
        id="inline-5jT7GTXUIMFIFJmL7bT8"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Contact Form-prebuilt (1)"
        data-height="400"
        data-layout-iframe-id="inline-5jT7GTXUIMFIFJmL7bT8"
        data-form-id="5jT7GTXUIMFIFJmL7bT8"
        title="Contact Form-prebuilt (1)"
      />

      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}
