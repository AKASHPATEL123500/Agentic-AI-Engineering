import type { IToolRegistry } from "../../01-registry-and-execution/06-tool-registry/src/02-registry-contract-and-errors/src/01-registry-Interfaces-&-contracts.ts";
import type { ToolPlugIn } from "./plugin.types";

export class PluginManger {
  private installedPlugins = new Map<string, ToolPlugIn>();

  constructor(private registry: IToolRegistry) {}

  /**
   * 🔌 1. Install Plugin (UI ka [+] Button)
   * @param plugIn
   */
  async install(plugIn: ToolPlugIn): Promise<void> {
    if (this.installedPlugins.has(plugIn.id)) {
      console.log(`Plug-In is alredy installed ${plugIn.name}`);
      return;
    }

    console.log(`Plug-In is installing: ${plugIn.name}  v${plugIn.version}`);

    if (plugIn.init) {
      await plugIn.init();
    }

    for (const tool of plugIn.tools) {
      this.registry.register(tool);
    }

    this.installedPlugins.set(plugIn.id, plugIn);
    console.log(
      `Plug-In intsall successfully and save it ${plugIn.name}  and ${plugIn.tools.length}!..`,
    );
  }
  /**
   * 2. Unintsall plugin
   * @param pluginId
   */
  async uninstall(pluginId: string): Promise<void> {
    const plugin = this.installedPlugins.get(pluginId);
    if (!plugin) {
      console.log(`❌ Plugin with ID '${pluginId}' not found.`);
      return;
    }

    console.log(`⏳ Uninstalling Plugin: ${plugin.name}...`);

    for (const tool of plugin.tools) {
      this.registry.unregister(tool.name);
    }

    this.installedPlugins.delete(pluginId);
    console.log(`PlugIn Tool Unstall successfully ${plugin.name}`);
  }

  listInstalled(): ToolPlugIn[] {
    return Array.from(this.installedPlugins.values());
  }
}
