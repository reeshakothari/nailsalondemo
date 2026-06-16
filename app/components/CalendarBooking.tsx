'use client';

import Script from 'next/script';

export default function CalendarBooking() {
  return (
    <>
      <iframe
        src="https://api.leadconnectorhq.com/widget/booking/IlTqttMUgMcDF9MY224M"
        style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '600px' }}
        scrolling="no"
        id="IlTqttMUgMcDF9MY224M_1781163230748"
      />
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}
