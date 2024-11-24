import { AppleDevice, ApplePlatform } from './types';
import { NotificationService } from './NotificationService';

export class iOSIntegration {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async registeriOS(deviceInfo: Partial<AppleDevice>) {
    const device: AppleDevice = {
      id: `ios_${Date.now()}`,
      name: deviceInfo.name || 'Unknown iOS Device',
      platform: ApplePlatform.iOS,
      osVersion: deviceInfo.osVersion || 'Unknown',
      model: deviceInfo.model || 'Unknown',
      pushToken: deviceInfo.pushToken,
    };

    this.notificationService.registerDevice(device);
    return device.id;
  }

  async sendNotification(title: string, body: string, deviceId?: string) {
    await this.notificationService.sendNotification({
      title,
      body,
      sound: 'default',
      targetDevices: deviceId ? [deviceId] : undefined,
    });
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    triggerDate: Date,
    deviceId?: string
  ) {
    await this.notificationService.sendNotification({
      title,
      body,
      category: 'scheduled',
      userInfo: {
        scheduledFor: triggerDate.toISOString(),
        local: true,
      },
      targetDevices: deviceId ? [deviceId] : undefined,
    });
  }

  async requestLocation(deviceId?: string) {
    await this.notificationService.sendNotification({
      title: 'Location Request',
      body: 'Amelia needs your current location',
      category: 'location_request',
      userInfo: {
        requiresResponse: true,
      },
      targetDevices: deviceId ? [deviceId] : undefined,
    });
  }

  async triggerShortcut(
    shortcutName: string,
    parameters?: Record<string, any>,
    deviceId?: string
  ) {
    await this.notificationService.sendNotification({
      title: 'Run Shortcut',
      body: `Running shortcut: ${shortcutName}`,
      category: 'shortcut',
      userInfo: {
        shortcutName,
        parameters,
      },
      targetDevices: deviceId ? [deviceId] : undefined,
    });
  }
}