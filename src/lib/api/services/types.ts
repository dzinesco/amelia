export interface Email {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  body: string;
}

export interface EmailOptions {
  to?: string;
  subject?: string;
  body?: string;
  limit?: number;
  query?: string;
}

export interface EmailService {
  listEmails(options: EmailOptions): Promise<Email[]>;
  sendEmail(options: EmailOptions): Promise<void>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  attendees?: string[];
}

export interface CalendarOptions {
  start?: Date;
  end?: Date;
  limit?: number;
}

export interface CalendarService {
  listEvents(options: CalendarOptions): Promise<CalendarEvent[]>;
  createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent>;
  updateEvent(event: CalendarEvent): Promise<CalendarEvent>;
  deleteEvent(eventId: string): Promise<void>;
}