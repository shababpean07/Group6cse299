"use client";

import React, { useEffect, useState } from 'react';
import { generateQrDataUrl } from '@/lib/qr';
import { X, Calendar, MapPin, Clock, QrCode, CheckCircle } from 'lucide-react';

type EventDetails = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  clubName: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  ticket: string;
  eventDetails?: EventDetails | null;
};

export function QRCodeModal({ open, onClose, ticket, eventDetails }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (open && ticket) {
      setIsGenerating(true);
      generateQrDataUrl(ticket, 300).then((u) => {
        if (mounted) {
          setUrl(u);
          setIsGenerating(false);
        }
      }).catch(() => {
        if (mounted) {
          setUrl(null);
          setIsGenerating(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [open, ticket]);

  if (!open) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      role="dialog" 
      aria-label="Event Entry Pass"
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,0.6)', 
        backdropFilter: 'blur(4px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          width: 380, 
          background: '#fff', 
          borderRadius: 20, 
          padding: 0, 
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
          padding: '24px 24px 20px',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircle style={{ width: 20, height: 20 }} />
                <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.9 }}>RSVP Confirmed</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                {eventDetails?.title || 'Event Entry Pass'}
              </h2>
              <p style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
                {eventDetails?.clubName || 'NSU ClubHub'}
              </p>
            </div>
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff'
              }}
            >
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>

        {/* Event Details */}
        <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar style={{ width: 16, height: 16, color: '#0D7377' }} />
              <span style={{ fontSize: 13, color: '#334155' }}>
                {eventDetails?.date ? formatDate(eventDetails.date) : 'Event Date'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock style={{ width: 16, height: 16, color: '#0D7377' }} />
              <span style={{ fontSize: 13, color: '#334155' }}>
                {eventDetails?.time || 'Event Time'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin style={{ width: 16, height: 16, color: '#0D7377' }} />
              <span style={{ fontSize: 13, color: '#334155' }}>
                {eventDetails?.venue || 'Venue TBA'}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            background: '#fff', 
            padding: 16, 
            borderRadius: 16, 
            border: '2px solid #0D7377',
            boxShadow: '0 4px 20px rgba(13,115,119,0.15)'
          }}>
            {url ? (
              <img src={url} alt="QR Code" style={{ width: 240, height: 240, display: 'block' }} />
            ) : isGenerating ? (
              <div style={{ width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <div style={{ 
                  width: 40, height: 40, 
                  border: '3px solid #e2e8f0', 
                  borderTopColor: '#0D7377', 
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span style={{ color: '#64748b', fontSize: 13 }}>Generating QR Code...</span>
              </div>
            ) : (
              <div style={{ width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: 8 }}>
                <QrCode style={{ width: 48, height: 48, color: '#94a3b8' }} />
              </div>
            )}
          </div>
          
          <p style={{ textAlign: 'center', color: '#475569', marginTop: 16, fontSize: 13, lineHeight: 1.5 }}>
            Present this QR code at the venue entrance<br/>
            <strong>Scan to verify your attendance</strong>
          </p>

          <div style={{ 
            marginTop: 16, 
            padding: '8px 16px', 
            background: '#f0fdf4', 
            borderRadius: 8,
            border: '1px solid #bbf7d0'
          }}>
            <span style={{ fontSize: 11, color: '#166534', fontFamily: 'monospace' }}>
              Ticket: {ticket.substring(0, 25)}...
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '12px 24px', 
          background: '#f8fafc', 
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            Powered by NSU ClubHub
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default QRCodeModal;
