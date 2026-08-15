#!/usr/bin/env bun
import { Command } from "commander";

const program = new Command();

program
  .name("ai-agent")
  .description("This is very powerful ai agent made by akash reddy")
  .version("1.0.0");

program
  .command("wakeup")
  .description("show the cli")
  .action(async () => {
    console.log("CLI is ready");
  });

await program.parseAsync(process.argv);
