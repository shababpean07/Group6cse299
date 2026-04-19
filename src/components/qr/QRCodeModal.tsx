"use client";

import React, { useEffect, useState } from 'react';
import { generateQrDataUrl } from '@/lib/qr';

type Props = {
  open: boolean;
  onClose: () => void;
  data: string | null;
};

export function QRCodeModal({ open, onClose, data }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (open && data) {
      generateQrDataUrl(data).then((u) => {
        if (mounted) setUrl(u);
      }).catch(() => {
        if (mounted) setUrl(null);
      });
    }
    return () => {
      mounted = false;
    };
  }, [open, data]);

  if (!open) return null;

  return (
    <div role="dialog" aria-label="QR Code" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 320, background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong>Event Entry Pass</strong>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
          {url ? (
            <img src={url} alt="QR Code" style={{ width: 256, height: 256 }} />
          ) : (
            <div style={{ width: 256, height: 256, display: 'grid', placeItems: 'center', border: '1px solid #eee' }}>
              <span>Generating QR...</span>
            </div>
          )}
        </div>
        <p style={{ textAlign: 'center', color: '#555', marginTop: 8 }}>Present this QR code at event entry</p>
      </div>
    </div>
  );
}

export default QRCodeModal;
