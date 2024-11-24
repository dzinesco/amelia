import { z } from 'zod';
import { EncryptionService } from './encryption';

export enum StorageType {
  Local = 'local',
  Cloud = 'cloud',
}

export enum DataCategory {
  PersonalInfo = 'personal_info',
  Preferences = 'preferences',
  ApiKeys = 'api_keys',
  Messages = 'messages',
  Usage = 'usage',
}

const DataPermissionSchema = z.object({
  category: z.nativeEnum(DataCategory),
  storageType: z.nativeEnum(StorageType),
  retentionDays: z.number().min(1),
  allowSharing: z.boolean(),
  encryptionRequired: z.boolean(),
});

export type DataPermission = z.infer<typeof DataPermissionSchema>;

export class DataProtectionService {
  private encryptionService: EncryptionService;
  private permissions: Map<DataCategory, DataPermission>;

  constructor() {
    this.encryptionService = new EncryptionService();
    this.permissions = new Map();
    this.initializeDefaultPermissions();
  }

  private initializeDefaultPermissions() {
    const defaults: Record<DataCategory, DataPermission> = {
      [DataCategory.PersonalInfo]: {
        category: DataCategory.PersonalInfo,
        storageType: StorageType.Local,
        retentionDays: 365,
        allowSharing: false,
        encryptionRequired: true,
      },
      [DataCategory.Preferences]: {
        category: DataCategory.Preferences,
        storageType: StorageType.Cloud,
        retentionDays: 730,
        allowSharing: false,
        encryptionRequired: true,
      },
      [DataCategory.ApiKeys]: {
        category: DataCategory.ApiKeys,
        storageType: StorageType.Local,
        retentionDays: 90,
        allowSharing: false,
        encryptionRequired: true,
      },
      [DataCategory.Messages]: {
        category: DataCategory.Messages,
        storageType: StorageType.Cloud,
        retentionDays: 180,
        allowSharing: false,
        encryptionRequired: true,
      },
      [DataCategory.Usage]: {
        category: DataCategory.Usage,
        storageType: StorageType.Cloud,
        retentionDays: 90,
        allowSharing: true,
        encryptionRequired: false,
      },
    };

    Object.values(defaults).forEach(permission => {
      this.permissions.set(permission.category, permission);
    });
  }

  async storeData(
    category: DataCategory,
    data: any,
    encryptionKey?: string
  ): Promise<void> {
    const permission = this.permissions.get(category);
    if (!permission) {
      throw new Error(`No permissions defined for category: ${category}`);
    }

    if (permission.encryptionRequired && !encryptionKey) {
      throw new Error('Encryption key required for this data category');
    }

    const serializedData = JSON.stringify(data);
    const processedData = permission.encryptionRequired && encryptionKey
      ? await this.encryptionService.encrypt(serializedData, encryptionKey)
      : serializedData;

    if (permission.storageType === StorageType.Local) {
      await this.storeLocally(category, processedData);
    } else {
      await this.storeInCloud(category, processedData);
    }
  }

  async retrieveData(
    category: DataCategory,
    encryptionKey?: string
  ): Promise<any> {
    const permission = this.permissions.get(category);
    if (!permission) {
      throw new Error(`No permissions defined for category: ${category}`);
    }

    if (permission.encryptionRequired && !encryptionKey) {
      throw new Error('Encryption key required for this data category');
    }

    const rawData = permission.storageType === StorageType.Local
      ? await this.retrieveLocally(category)
      : await this.retrieveFromCloud(category);

    if (!rawData) return null;

    const decryptedData = permission.encryptionRequired && encryptionKey
      ? await this.encryptionService.decrypt(rawData, encryptionKey)
      : rawData;

    return JSON.parse(decryptedData);
  }

  updatePermissions(category: DataCategory, updates: Partial<DataPermission>): void {
    const current = this.permissions.get(category);
    if (!current) {
      throw new Error(`No permissions defined for category: ${category}`);
    }

    const updated = { ...current, ...updates };
    const validated = DataPermissionSchema.parse(updated);
    this.permissions.set(category, validated);
  }

  getPermissions(category: DataCategory): DataPermission | undefined {
    return this.permissions.get(category);
  }

  private async storeLocally(category: string, data: string): Promise<void> {
    localStorage.setItem(`amelia_${category}`, data);
  }

  private async retrieveLocally(category: string): Promise<string | null> {
    return localStorage.getItem(`amelia_${category}`);
  }

  private async storeInCloud(category: string, data: string): Promise<void> {
    // Implement cloud storage logic
    throw new Error('Cloud storage not implemented');
  }

  private async retrieveFromCloud(category: string): Promise<string | null> {
    // Implement cloud retrieval logic
    throw new Error('Cloud retrieval not implemented');
  }
}