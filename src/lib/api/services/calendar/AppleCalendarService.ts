import { AuthManager } from '../../auth/AuthManager';
import { CalendarService, CalendarEvent, CalendarOptions } from '../types';

export class AppleCalendarService implements CalendarService {
  private auth: AuthManager;
  private baseUrl = 'https://p99-caldav.icloud.com';

  constructor(auth: AuthManager) {
    this.auth = auth;
  }

  async listEvents(options: CalendarOptions): Promise<CalendarEvent[]> {
    try {
      const token = await this.auth.getValidToken();
      const response = await fetch(`${this.baseUrl}/calendars`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      return this.parseAppleEvents(data);
    } catch (error) {
      console.error('Error fetching Apple Calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    try {
      const token = await this.auth.getValidToken();
      const response = await fetch(`${this.baseUrl}/calendars`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.createAppleEvent(event)),
      });

      if (!response.ok) {
        throw new Error('Failed to create calendar event');
      }

      const data = await response.json();
      return this.parseAppleEvent(data);
    } catch (error) {
      console.error('Error creating Apple Calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const token = await this.auth.getValidToken();
      const response = await fetch(`${this.baseUrl}/calendars/${event.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.createAppleEvent(event)),
      });

      if (!response.ok) {
        throw new Error('Failed to update calendar event');
      }

      const data = await response.json();
      return this.parseAppleEvent(data);
    } catch (error) {
      console.error('Error updating Apple Calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const token = await this.auth.getValidToken();
      const response = await fetch(`${this.baseUrl}/calendars/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete calendar event');
      }
    } catch (error) {
      console.error('Error deleting Apple Calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  private parseAppleEvents(data: any): CalendarEvent[] {
    return data.map(this.parseAppleEvent);
  }

  private parseAppleEvent(event: any): CalendarEvent {
    return {
      id: event.id,
      title: event.title,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      description: event.description,
      location: event.location,
      attendees: event.attendees,
    };
  }

  private createAppleEvent(event: Omit<CalendarEvent, 'id'>): any {
    return {
      title: event.title,
      startDate: event.start.toISOString(),
      endDate: event.end.toISOString(),
      description: event.description,
      location: event.location,
      attendees: event.attendees,
    };
  }
}