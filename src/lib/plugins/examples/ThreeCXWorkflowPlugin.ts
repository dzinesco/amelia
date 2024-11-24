import { WorkflowPlugin, PluginType, WorkflowContext } from '../types';
import { ThreeCXService } from '../../api/services/3cx/ThreeCXService';

export class ThreeCXWorkflowPlugin implements WorkflowPlugin {
  metadata = {
    id: '3cx-workflow',
    name: '3CX Workflow Plugin',
    description: 'Provides 3CX communication workflow actions and triggers',
    version: '1.0.0',
    type: PluginType.Workflow,
  };

  private service: ThreeCXService;

  constructor(apiKey: string, baseUrl: string) {
    this.service = new ThreeCXService(apiKey, baseUrl);
  }

  triggers = [
    {
      id: '3cx-incoming-call',
      name: 'Incoming Call',
      description: 'Triggers when a new call is received',
      execute: async (context: WorkflowContext) => {
        // Implementation for incoming call trigger
      },
    },
    {
      id: '3cx-message-received',
      name: 'Message Received',
      description: 'Triggers when a new message is received',
      execute: async (context: WorkflowContext) => {
        // Implementation for message received trigger
      },
    },
  ];

  actions = [
    {
      id: '3cx-send-message',
      name: 'Send Message',
      description: 'Sends an SMS message',
      execute: async (context: WorkflowContext) => {
        const { phoneNumber, content } = context.data;
        return this.service.sendMessage(phoneNumber, content);
      },
    },
    {
      id: '3cx-initiate-call',
      name: 'Initiate Call',
      description: 'Starts an outbound call',
      execute: async (context: WorkflowContext) => {
        const { phoneNumber, options } = context.data;
        return this.service.initiateCall(phoneNumber, options);
      },
    },
    {
      id: '3cx-schedule-reminder',
      name: 'Schedule Reminder',
      description: 'Schedules a reminder message or call',
      execute: async (context: WorkflowContext) => {
        const { type, phoneNumber, content, scheduledTime, options } = context.data;
        
        if (type === 'message') {
          return this.service.scheduleMessage(phoneNumber, content, new Date(scheduledTime));
        } else {
          return this.service.scheduleCall(phoneNumber, new Date(scheduledTime), options);
        }
      },
    },
  ];

  conditions = [
    {
      id: '3cx-call-status',
      name: 'Call Status',
      description: 'Checks the status of a call',
      evaluate: async (context: WorkflowContext) => {
        const { callId, expectedStatus } = context.data;
        const status = await this.service.getCallStatus(callId);
        return status === expectedStatus;
      },
    },
  ];

  async initialize(): Promise<void> {
    // Initialize 3CX service connections
  }

  async cleanup(): Promise<void> {
    // Cleanup 3CX service connections
  }
}