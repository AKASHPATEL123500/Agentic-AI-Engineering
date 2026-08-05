// Registry Event Listenr ka mtlb hai ki
// jab bhi koi nayi tool add ho hamare Map mein Tools regsitry
// mein to hum ek ek message fire karege ki tool regsiter success ho gaya hai
// simpel mtlb ye hai ki jise hi koi activity ho tab event trigger ho jaye
// eventEmmiter jo hai yaha listen karega and retunkarega

import type { ToolType } from "../02-registry-contract-and-errors/src/types.ts";

// const emmit = new EventMiiter()
// emmit.on("event_ka_naam", data);

// Tool regsitry event listner type initlize
export type ToolRegistryEventListener = (
  toolName: string,
  tool?: ToolType,
) => void;

// event listener classes
export class RegistryEventEmitter {
  private registerListeners: ToolRegistryEventListener[] = [];
  private unregisterListeners: ToolRegistryEventListener[] = [];

  // Register Event Listener Subscribe
  onRegister(listener: ToolRegistryEventListener): void {
    this.registerListeners.push(listener);
  }

  // Unregister Event Listener Subscribe
  onUnregister(listener: ToolRegistryEventListener): void {
    this.unregisterListeners.push(listener);
  }

  // Trigger Register Event
  emmitRegister(tool: ToolType) {
    this.registerListeners.forEach((listener) => listener(tool.name, tool));
  }

  // Trigger unRegister Event
  emmitUnRegister(toolName: string): void {
    this.unregisterListeners.forEach((listener) => listener(toolName));
  }
}
