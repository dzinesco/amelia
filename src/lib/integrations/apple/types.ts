import { z } from 'zod';

export enum ApplePlatform {
  iOS = 'ios',
  macOS = 'macos',
  watchOS = 'watchos'
}

export const AppleDeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.nativeEnum(ApplePlatform),
  osVersion: z.string(),
  model: z.string(),
  pushToken: z.string().optional()
});

export type AppleDevice = z.infer<typeof AppleDeviceSchema>;

export interface SiriIntent {
  id: string;
  name: string;
  phrases: string[];
  parameters?: {
    name: string;
    type: string;
    required: boolean;
  }[];
}

export interface AppleNotification {
  title: string;
  body: string;
  badge?: number;
  sound?: string;
  category?: string;
  threadId?: string;
  userInfo?: Record<string, any>;
  targetDevices?: string[];
}

export interface AppleIntegrationConfig {
  teamId: string;
  keyId: string;
  privateKey: string;
  bundleId: string;
  pushCertificate: string;
}