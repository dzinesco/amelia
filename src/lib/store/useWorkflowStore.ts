import { create } from 'zustand';
import { WorkflowEngine } from '../workflows/WorkflowEngine';
import { PluginManager } from '../plugins/PluginManager';

interface WorkflowState {
  workflowEngine: WorkflowEngine;
  pluginManager: PluginManager;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  createWorkflow: (workflow: any) => void;
  deleteWorkflow: (workflowId: string) => void;
  executeWorkflow: (workflowId: string, data?: Record<string, any>) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => {
  const pluginManager = new PluginManager();
  const workflowEngine = new WorkflowEngine(pluginManager);

  return {
    workflowEngine,
    pluginManager,
    isInitialized: false,

    initialize: async () => {
      if (get().isInitialized) return;

      // Register built-in plugins
      const plugins = [
        // Add your plugins here
      ];

      for (const plugin of plugins) {
        await get().pluginManager.registerPlugin(plugin);
      }

      set({ isInitialized: true });
    },

    createWorkflow: (workflow) => {
      get().workflowEngine.registerWorkflow(workflow);
    },

    deleteWorkflow: (workflowId) => {
      get().workflowEngine.unregisterWorkflow(workflowId);
    },

    executeWorkflow: async (workflowId, data) => {
      await get().workflowEngine.executeWorkflow(workflowId, data);
    },
  };
});