"use client";

import React from 'react';
import { useQrTicket } from '@/context/QrTicketContext';

export default function RsvpDemoPage() {
  const { RSVP } = useQrTicket();

  const handleRsvp = () => {
    // Use a deterministic demo event id
    RSVP('demo-event-001');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>QR RSVP Demo</h1>
      <p>Click the button to RSVP to a demo event and generate a QR code.</p>
      <button onClick={handleRsvp} style={{ padding: '8px 12px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none' }}>
        RSVP Demo Event 001
      </button>
    </div>
  );
}
