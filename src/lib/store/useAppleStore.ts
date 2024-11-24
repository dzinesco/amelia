import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SiriIntegration } from '../integrations/apple/SiriIntegration';
import { NotificationService } from '../integrations/apple/NotificationService';
import { MacIntegration } from '../integrations/apple/MacIntegration';
import { iOSIntegration } from '../integrations/apple/iOSIntegration';
import { AppleDevice, AppleIntegrationConfig } from '../integrations/apple/types';

interface AppleState {
  siri: SiriIntegration;
  notifications: NotificationService;
  mac: MacIntegration;
  ios: iOSIntegration;
  devices: AppleDevice[];
  isInitialized: boolean;
  config: AppleIntegrationConfig | null;
  initialize: (config: AppleIntegrationConfig) => void;
  addDevice: (device: AppleDevice) => void;
  removeDevice: (deviceId: string) => void;
  sendNotification: (title: string, body: string, deviceIds?: string[]) => Promise<void>;
}

export const useAppleStore = create<AppleState>()(
  persist(
    (set, get) => ({
      siri: new SiriIntegration(),
      notifications: new NotificationService({} as AppleIntegrationConfig),
      mac: new MacIntegration({} as NotificationService),
      ios: new iOSIntegration({} as NotificationService),
      devices: [],
      isInitialized: false,
      config: null,

      initialize: (config) => {
        const notifications = new NotificationService(config);
        const mac = new MacIntegration(notifications);
        const ios = new iOSIntegration(notifications);

        set({
          notifications,
          mac,
          ios,
          config,
          isInitialized: true,
        });
      },

      addDevice: (device) => {
        set((state) => ({
          devices: [...state.devices, device]
        }));
        get().notifications.registerDevice(device);
      },

      removeDevice: (deviceId) => {
        set((state) => ({
          devices: state.devices.filter(d => d.id !== deviceId)
        }));
        get().notifications.unregisterDevice(deviceId);
      },

      sendNotification: async (title, body, deviceIds) => {
        await get().notifications.sendNotification({
          title,
          body,
          targetDevices: deviceIds,
        });
      },
    }),
    {
      name: 'apple-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        devices: state.devices,
        config: state.config,
        isInitialized: state.isInitialized,
      }),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            devices: [],
            config: null,
            isInitialized: false,
          };
        }
        return persistedState;
      },
    }
  )
);