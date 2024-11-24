import { z } from 'zod';

export enum PluginType {
  Integration = 'integration',
  Workflow = 'workflow',
  Action = 'action',
}

export const PluginMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  type: z.nativeEnum(PluginType),
  author: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

export type PluginMetadata = z.infer<typeof PluginMetadataSchema>;

export interface Plugin {
  metadata: PluginMetadata;
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
}

export interface WorkflowPlugin extends Plugin {
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
}

export interface WorkflowTrigger {
  id: string;
  name: string;
  description: string;
  execute: (context: WorkflowContext) => Promise<void>;
}

export interface WorkflowAction {
  id: string;
  name: string;
  description: string;
  execute: (context: WorkflowContext) => Promise<void>;
}

export interface WorkflowCondition {
  id: string;
  name: string;
  description: string;
  evaluate: (context: WorkflowContext) => Promise<boolean>;
}

export interface WorkflowContext {
  data: Record<string, any>;
  services: Record<string, any>;
  logger: WorkflowLogger;
}