import { google } from 'googleapis';
import { AuthManager } from '../../auth/AuthManager';
import { CalendarService, CalendarEvent, CalendarOptions } from '../types';

export class GoogleCalendarService implements CalendarService {
  private auth: AuthManager;
  private calendar = google.calendar('v3');

  constructor(auth: AuthManager) {
    this.auth = auth;
  }

  async listEvents(options: CalendarOptions): Promise<CalendarEvent[]> {
    try {
      const accessToken = await this.auth.getValidToken();
      const response = await this.calendar.events.list({
        oauth_token: accessToken,
        calendarId: 'primary',
        timeMin: options.start?.toISOString(),
        timeMax: options.end?.toISOString(),
        maxResults: options.limit,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return (response.data.items || []).map(this.parseGoogleEvent);
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    try {
      const accessToken = await this.auth.getValidToken();
      const response = await this.calendar.events.insert({
        oauth_token: accessToken,
        calendarId: 'primary',
        requestBody: this.createGoogleEvent(event),
      });

      return this.parseGoogleEvent(response.data);
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const accessToken = await this.auth.getValidToken();
      const response = await this.calendar.events.update({
        oauth_token: accessToken,
        calendarId: 'primary',
        eventId: event.id,
        requestBody: this.createGoogleEvent(event),
      });

      return this.parseGoogleEvent(response.data);
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const accessToken = await this.auth.getValidToken();
      await this.calendar.events.delete({
        oauth_token: accessToken,
        calendarId: 'primary',
        eventId,
      });
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  private parseGoogleEvent(event: any): CalendarEvent {
    return {
      id: event.id,
      title: event.summary,
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
      description: event.description,
      location: event.location,
      attendees: event.attendees?.map((a: any) => a.email),
    };
  }

  private createGoogleEvent(event: Omit<CalendarEvent, 'id'>): any {
    return {
      summary: event.title,
      description: event.description,
      location: event.location,
      start: {
        dateTime: event.start.toISOString(),
      },
      end: {
        dateTime: event.end.toISOString(),
      },
      attendees: event.attendees?.map((email) => ({ email })),
    };
  }
}