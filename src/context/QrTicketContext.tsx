"use client";

import React, { createContext, useContext, useState } from 'react';
import { eventsApi } from '@/lib/api';
import { QRCodeModal } from '@/components/qr/QRCodeModal';

type EventDetails = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  clubName: string;
};

type ContextValue = {
  RSVP: (eventId: string, eventInfo?: Partial<EventDetails>) => Promise<void>;
};

const QrTicketContext = createContext<ContextValue | undefined>(undefined);

export function QrTicketProvider({ children }: { children: React.ReactNode }) {
  const [ticket, setTicket] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [open, setOpen] = useState(false);

  const RSVP = async (eventId: string, eventInfo?: Partial<EventDetails>) => {
    try {
      const resp: any = await eventsApi.rsvp(eventId);
      const t = resp?.ticket ?? `EV-${eventId}-USER-TICKET-${Date.now()}`;
      
      const details: EventDetails = {
        id: eventId,
        title: eventInfo?.title || 'Event',
        date: eventInfo?.date || new Date().toISOString(),
        time: eventInfo?.time || 'TBA',
        venue: eventInfo?.venue || 'TBA',
        clubName: eventInfo?.clubName || 'NSU ClubHub',
      };
      
      setTicket(t);
      setEventDetails(details);
      setOpen(true);
    } catch {
      const t = `EV-${eventId}-USER-TICKET-${Date.now()}`;
      const details: EventDetails = {
        id: eventId,
        title: eventInfo?.title || 'Event',
        date: eventInfo?.date || new Date().toISOString(),
        time: eventInfo?.time || 'TBA',
        venue: eventInfo?.venue || 'TBA',
        clubName: eventInfo?.clubName || 'NSU ClubHub',
      };
      setTicket(t);
      setEventDetails(details);
      setOpen(true);
    }
  };

  const close = () => {
    setOpen(false);
    setTicket(null);
    setEventDetails(null);
  };

  return (
    <QrTicketContext.Provider value={{ RSVP }}>
      {children}
      {open && ticket && (
        <QRCodeModal 
          open={open} 
          onClose={close} 
          ticket={ticket}
          eventDetails={eventDetails}
        />
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

export { QRCodeModal } from '@/components/qr/QRCodeModal';
