import { 
  WorkflowPlugin, 
  WorkflowContext, 
  WorkflowTrigger,
  WorkflowAction,
  WorkflowCondition 
} from '../plugins/types';
import { PluginManager } from '../plugins/PluginManager';

interface WorkflowStep {
  type: 'trigger' | 'action' | 'condition';
  id: string;
  config?: Record<string, any>;
  next?: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  steps: Record<string, WorkflowStep>;
  context: Record<string, any>;
}

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private running: Set<string> = new Set();

  constructor(private pluginManager: PluginManager) {}

  registerWorkflow(workflow: Workflow): void {
    if (this.workflows.has(workflow.id)) {
      throw new Error(`Workflow ${workflow.id} already exists`);
    }

    this.validateWorkflow(workflow);
    this.workflows.set(workflow.id, workflow);
  }

  unregisterWorkflow(workflowId: string): void {
    if (this.running.has(workflowId)) {
      throw new Error(`Cannot unregister running workflow ${workflowId}`);
    }
    this.workflows.delete(workflowId);
  }

  async executeWorkflow(workflowId: string, initialData: Record<string, any> = {}): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || !workflow.enabled) return;

    if (this.running.has(workflowId)) {
      throw new Error(`Workflow ${workflowId} is already running`);
    }

    this.running.add(workflowId);

    try {
      const context: WorkflowContext = {
        data: { ...workflow.context, ...initialData },
        services: {},
        logger: this.createLogger(workflowId),
      };

      const startSteps = Object.entries(workflow.steps)
        .filter(([_, step]) => step.type === 'trigger')
        .map(([id]) => id);

      await Promise.all(
        startSteps.map((stepId) => this.executeStep(workflow, stepId, context))
      );
    } finally {
      this.running.delete(workflowId);
    }
  }

  private async executeStep(
    workflow: Workflow,
    stepId: string,
    context: WorkflowContext
  ): Promise<void> {
    const step = workflow.steps[stepId];
    if (!step) return;

    try {
      let shouldContinue = true;

      switch (step.type) {
        case 'trigger':
          await this.executeTrigger(step.id, context);
          break;
        case 'condition':
          shouldContinue = await this.evaluateCondition(step.id, context);
          break;
        case 'action':
          await this.executeAction(step.id, context);
          break;
      }

      if (shouldContinue && step.next) {
        await Promise.all(
          step.next.map((nextId) => this.executeStep(workflow, nextId, context))
        );
      }
    } catch (error) {
      context.logger.error(`Error executing step ${stepId}:`, error);
      throw error;
    }
  }

  private async executeTrigger(triggerId: string, context: WorkflowContext): Promise<void> {
    const plugin = this.findPluginForTrigger(triggerId);
    if (!plugin) throw new Error(`Trigger ${triggerId} not found`);

    const trigger = plugin.triggers.find((t) => t.id === triggerId);
    if (!trigger) throw new Error(`Trigger ${triggerId} not found in plugin`);

    await trigger.execute(context);
  }

  private async executeAction(actionId: string, context: WorkflowContext): Promise<void> {
    const plugin = this.findPluginForAction(actionId);
    if (!plugin) throw new Error(`Action ${actionId} not found`);

    const action = plugin.actions.find((a) => a.id === actionId);
    if (!action) throw new Error(`Action ${actionId} not found in plugin`);

    await action.execute(context);
  }

  private async evaluateCondition(conditionId: string, context: WorkflowContext): Promise<boolean> {
    const plugin = this.findPluginForCondition(conditionId);
    if (!plugin) throw new Error(`Condition ${conditionId} not found`);

    const condition = plugin.conditions.find((c) => c.id === conditionId);
    if (!condition) throw new Error(`Condition ${conditionId} not found in plugin`);

    return condition.evaluate(context);
  }

  private findPluginForTrigger(triggerId: string): WorkflowPlugin | undefined {
    return this.pluginManager
      .getPluginsByType('workflow')
      .find((p: any) => p.triggers?.some((t: WorkflowTrigger) => t.id === triggerId)) as WorkflowPlugin;
  }

  private findPluginForAction(actionId: string): WorkflowPlugin | undefined {
    return this.pluginManager
      .getPluginsByType('workflow')
      .find((p: any) => p.actions?.some((a: WorkflowAction) => a.id === actionId)) as WorkflowPlugin;
  }

  private findPluginForCondition(conditionId: string): WorkflowPlugin | undefined {
    return this.pluginManager
      .getPluginsByType('workflow')
      .find((p: any) => p.conditions?.some((c: WorkflowCondition) => c.id === conditionId)) as WorkflowPlugin;
  }

  private validateWorkflow(workflow: Workflow): void {
    // Validate steps exist
    for (const step of Object.values(workflow.steps)) {
      if (step.next) {
        for (const nextId of step.next) {
          if (!workflow.steps[nextId]) {
            throw new Error(`Invalid step reference: ${nextId}`);
          }
        }
      }
    }

    // Validate no cycles
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const checkCycles = (stepId: string): void => {
      if (recursionStack.has(stepId)) {
        throw new Error(`Cycle detected in workflow at step ${stepId}`);
      }
      if (visited.has(stepId)) return;

      visited.add(stepId);
      recursionStack.add(stepId);

      const step = workflow.steps[stepId];
      if (step.next) {
        for (const nextId of step.next) {
          checkCycles(nextId);
        }
      }

      recursionStack.delete(stepId);
    };

    for (const [stepId, step] of Object.entries(workflow.steps)) {
      if (step.type === 'trigger') {
        checkCycles(stepId);
      }
    }
  }

  private createLogger(workflowId: string) {
    return {
      info: (message: string, ...args: any[]) => {
        console.log(`[Workflow ${workflowId}] ${message}`, ...args);
      },
      error: (message: string, ...args: any[]) => {
        console.error(`[Workflow ${workflowId}] ${message}`, ...args);
      },
      warn: (message: string, ...args: any[]) => {
        console.warn(`[Workflow ${workflowId}] ${message}`, ...args);
      },
    };
  }
}