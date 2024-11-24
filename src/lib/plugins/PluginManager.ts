import { Plugin, PluginMetadata, PluginType } from './types';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private dependencies: Map<string, Set<string>> = new Map();

  async registerPlugin(plugin: Plugin): Promise<void> {
    const metadata = plugin.metadata;

    // Validate plugin metadata
    if (this.plugins.has(metadata.id)) {
      throw new Error(`Plugin ${metadata.id} is already registered`);
    }

    // Check dependencies
    if (metadata.dependencies) {
      for (const dep of metadata.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Missing dependency: ${dep} for plugin ${metadata.id}`);
        }
      }
    }

    // Initialize plugin
    try {
      await plugin.initialize();
      this.plugins.set(metadata.id, plugin);
      this.updateDependencyGraph(metadata);
    } catch (error) {
      console.error(`Failed to initialize plugin ${metadata.id}:`, error);
      throw error;
    }
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    // Check if other plugins depend on this one
    for (const [id, deps] of this.dependencies.entries()) {
      if (deps.has(pluginId)) {
        throw new Error(
          `Cannot unregister plugin ${pluginId}: plugin ${id} depends on it`
        );
      }
    }

    // Cleanup and remove plugin
    try {
      await plugin.cleanup();
      this.plugins.delete(pluginId);
      this.dependencies.delete(pluginId);
    } catch (error) {
      console.error(`Failed to cleanup plugin ${pluginId}:`, error);
      throw error;
    }
  }

  getPlugin<T extends Plugin>(pluginId: string): T | undefined {
    return this.plugins.get(pluginId) as T | undefined;
  }

  getPluginsByType(type: PluginType): Plugin[] {
    return Array.from(this.plugins.values()).filter(
      (plugin) => plugin.metadata.type === type
    );
  }

  private updateDependencyGraph(metadata: PluginMetadata): void {
    if (!metadata.dependencies) return;

    const deps = new Set(metadata.dependencies);
    this.dependencies.set(metadata.id, deps);
  }
}