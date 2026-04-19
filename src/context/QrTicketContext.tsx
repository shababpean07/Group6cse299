"use client";

import React, { createContext, useContext, useState } from 'react';
import { eventsApi } from '@/lib/api';
import { QRCodeModal } from '@/components/qr/QRCodeModal';

type ContextValue = {
  RSVP: (eventId: string) => Promise<void>;
};

const QrTicketContext = createContext<ContextValue | undefined>(undefined);

export function QrTicketProvider({ children }: { children: React.ReactNode }) {
  const [ticket, setTicket] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const RSVP = async (eventId: string) => {
    try {
      // Call RSVP endpoint; expect a ticket in response
      const resp: any = await eventsApi.rsvp(eventId);
      const t = resp?.ticket ?? `EV-${eventId}-TICKET-${Date.now()}`;
      setTicket(t);
      setOpen(true);
    } catch {
      // Fallback: generate a synthetic ticket
      const t = `EV-${eventId}-TICKET-${Date.now()}`;
      setTicket(t);
      setOpen(true);
    }
  };

  const close = () => setOpen(false);

  return (
    <QrTicketContext.Provider value={{ RSVP }}>
      {children}
      {open && ticket && (
        <QRCodeModal open={open} onClose={close} data={ticket} />
      )}
    </QrTicketContext.Provider>
  );
}

export function useQrTicket() {
  const ctx = useContext(QrTicketContext);
  if (!ctx) {
    throw new Error('useQrTicket must be used within QrTicketProvider');
  }
  return ctx;
}

// Re-export for easier usage in pages/components
export { QRCodeModal } from '@/components/qr/QRCodeModal';
