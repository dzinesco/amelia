import { AppleDevice, ApplePlatform } from './types';
import { NotificationService } from './NotificationService';

export class MacIntegration {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async registerMac(deviceInfo: Partial<AppleDevice>) {
    const device: AppleDevice = {
      id: `mac_${Date.now()}`,
      name: deviceInfo.name || 'Unknown Mac',
      platform: ApplePlatform.macOS,
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

  async showDialog(
    message: string,
    buttons: string[] = ['OK', 'Cancel'],
    deviceId?: string
  ) {
    await this.notificationService.sendNotification({
      title: 'Action Required',
      body: message,
      category: 'dialog',
      userInfo: {
        buttons,
        requiresResponse: true,
      },
      targetDevices: deviceId ? [deviceId] : undefined,
    });
  }

  async executeScript(script: string, deviceId?: string): Promise<void> {
    await this.notificationService.sendNotification({
      title: 'Execute Script',
      body: 'A script execution has been requested',
      category: 'script',
      userInfo: {
        script,
        requiresPermission: true,
      },
      targetDevices: deviceId ? [deviceId] : undefined,
    });
  }
}