import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Smart AI responses based on keywords
const knowledgeBase: Record<string, string[]> = {
  club: [
    'NSU ClubHub features various clubs including Tech, Cultural, Sports, Arts, and Academic categories.',
    'You can browse clubs in the Clubs section and apply to join your favorite ones!',
    'Each club has its own recruitment cycles. Check the Recruitment page for open applications.',
  ],
  event: [
    'Events are categorized by type: Academic, Cultural, Sports, Tech, and Arts.',
    'You can RSVP to events and get a QR code entry pass.',
    'Check the Events calendar for upcoming events across all clubs.',
  ],
  recruitment: [
    'Recruitment cycles allow you to apply to join clubs.',
    'Most clubs open recruitment at the start of each semester.',
    'You can track your application status in the Recruitment section.',
  ],
  rsvp: [
    'RSVPing to an event gives you a QR code pass for entry.',
    'You can find your QR codes in the event confirmation.',
    'Present your QR code at the venue for quick check-in.',
  ],
  help: [
    'I can help you with: finding clubs, event details, recruitment cycles, and general NSU ClubHub questions.',
    'Try asking about specific clubs, upcoming events, or how to join a club!',
  ],
};

function generateSmartResponse(message: string): string {
  const lower = message.toLowerCase();
  
  // Greeting
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm your NSU ClubHub AI assistant. I can help you find clubs, events, or answer questions about the platform. What would you like to know?";
  }
  
  // About
  if (lower.includes('what') && (lower.includes('you') || lower.includes('nsu'))) {
    return "I'm the NSU ClubHub AI assistant! I can help you discover clubs, find events, understand recruitment cycles, and navigate the platform. Just ask!";
  }
  
  // Club-related questions
  if (lower.includes('club') || lower.includes('join')) {
    const responses = knowledgeBase.club;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Event-related questions
  if (lower.includes('event') || lower.includes('schedule') || lower.includes('when') || lower.includes('date')) {
    const responses = knowledgeBase.event;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Recruitment
  if (lower.includes('recruit') || lower.includes('apply') || lower.includes('application')) {
    const responses = knowledgeBase.recruitment;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // RSVP/Ticket
  if (lower.includes('rsvp') || lower.includes('ticket') || lower.includes('qr') || lower.includes('entry')) {
    const responses = knowledgeBase.rsvp;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Help request
  if (lower.includes('help') || lower.includes('how')) {
    const responses = knowledgeBase.help;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Thanks
  if (lower.includes('thank') || lower.includes('thanks')) {
    return "You're welcome! Feel free to ask if you have any more questions about NSU ClubHub.";
  }
  
  // Bye
  if (lower.includes('bye') || lower.includes('goodbye')) {
    return "Goodbye! Come back if you have more questions. Happy exploring!";
  }
  
  // Default smart response
  const defaultResponses = [
    "That's a great question! Let me help you - you can browse clubs in the Clubs section or check Events for upcoming activities.",
    "I can info on clubs, events, and recruitment. Have you checked the Events calendar recently?",
    "For specific help, try asking about clubs, events, or recruitment cycles. I'm happy to guide you!",
    "NSU ClubHub has many features! You can discover clubs, RSVP to events, and track your applications.",
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// AI chat endpoint with smart responses
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message } = req.body as { message?: string };
    const userId = (req as any).user?.id;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ reply: "Please send a message and I'll help you out!" });
    }
    
    const reply = generateSmartResponse(message);
    res.json({ reply, userId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: "Something went wrong. Please try again!" });
  }
});

// Public chat endpoint (optional - without authentication)
router.post('/chat/public', async (req, res) => {
  try {
    const { message } = req.body as { message?: string };
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ reply: "Please send a message and I'll help you out!" });
    }
    
    const reply = generateSmartResponse(message);
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: "Something went wrong. Please try again!" });
  }
});

export default router;