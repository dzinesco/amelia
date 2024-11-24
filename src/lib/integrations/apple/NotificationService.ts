import { AppleNotification, AppleDevice, AppleIntegrationConfig } from './types';

export class NotificationService {
  private config: AppleIntegrationConfig;
  private devices: Map<string, AppleDevice> = new Map();

  constructor(config: AppleIntegrationConfig) {
    this.config = config;
  }

  registerDevice(device: AppleDevice) {
    this.devices.set(device.id, device);
  }

  unregisterDevice(deviceId: string) {
    this.devices.delete(deviceId);
  }

  async sendNotification(notification: AppleNotification): Promise<void> {
    const targetDevices = notification.targetDevices || 
      Array.from(this.devices.values())
        .filter(device => device.pushToken)
        .map(device => device.id);

    const payload = this.createNotificationPayload(notification);

    await Promise.all(
      targetDevices.map(async (deviceId) => {
        const device = this.devices.get(deviceId);
        if (!device?.pushToken) return;

        try {
          await this.sendPushNotification(device.pushToken, payload);
        } catch (error) {
          console.error(`Failed to send notification to device ${deviceId}:`, error);
        }
      })
    );
  }

  private createNotificationPayload(notification: AppleNotification) {
    return {
      aps: {
        alert: {
          title: notification.title,
          body: notification.body,
        },
        badge: notification.badge,
        sound: notification.sound || 'default',
        category: notification.category,
        'thread-id': notification.threadId,
      },
      ...notification.userInfo,
    };
  }

  private async sendPushNotification(token: string, payload: any): Promise<void> {
    // Implementation using Apple Push Notification service (APNs)
    const apns = {
      method: 'POST',
      headers: {
        'apns-topic': this.config.bundleId,
        'apns-push-type': 'alert',
        'authorization': `bearer ${await this.getJWT()}`,
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(
      `https://api.push.apple.com/3/device/${token}`,
      apns
    );

    if (!response.ok) {
      throw new Error(`Push notification failed: ${response.statusText}`);
    }
  }

  private async getJWT(): Promise<string> {
    // Implementation for generating Apple Push Notification JWT
    // This would use the teamId, keyId, and privateKey from config
    return 'generated-jwt-token';
  }
}