#!/usr/bin/env node
/**
 * Universal agents menu - lists and launches agents from agents/ folder.
 * Add to any project: "agents": "node node_modules/.scripts/agents-menu.js"
 * Or inline:          "agents": "node scripts/agents-menu.js"
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import readline from 'readline';

const AGENTS_DIR = path.join(process.cwd(), 'agents');

function findAgents() {
  if (!fs.existsSync(AGENTS_DIR)) return [];
  return fs.readdirSync(AGENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .filter(d => !d.name.startsWith('.') && !d.name.startsWith('_') && d.name !== 'node_modules')
    .map(d => {
      const dir = path.join(AGENTS_DIR, d.name);
      const card = path.join(dir, 'agent.card.json');
      let meta = {};
      if (fs.existsSync(card)) {
        try { meta = JSON.parse(fs.readFileSync(card, 'utf8')); } catch {}
      }
      return {
        id: d.name,
        emoji: meta.emoji || '',
        title: meta.title || d.name,
        description: meta.description || '',
        path: dir
      };
    });
}

function listAgents(agents) {
  if (agents.length === 0) {
    console.log('No agents/ directory or no agents found.');
    console.log('Create agents/<name>/ folders to get started.');
    return;
  }
  console.log(`\n  Available Agents (${agents.length}):\n`);
  agents.forEach((a, i) => {
    const emoji = a.emoji ? a.emoji + ' ' : '';
    const desc = a.description ? ` - ${a.description.substring(0, 60)}` : '';
    console.log(`  [${i + 1}] ${emoji}${a.title}${desc}`);
  });
  console.log();
}

function launchAgent(agent) {
  console.log(`\nLaunching ${agent.title} in ${agent.path}...\n`);
  const child = spawn('claude', ['--continue', '--dangerously-skip-permissions'], {
    stdio: 'inherit',
    shell: true,
    cwd: agent.path
  });
  child.on('exit', code => process.exit(code || 0));
}

// Main
const agents = findAgents();
const arg = process.argv[2];

if (arg === 'list' || arg === 'ls' || arg === '--list') {
  listAgents(agents);
} else if (arg && !isNaN(arg)) {
  const idx = parseInt(arg) - 1;
  if (agents[idx]) launchAgent(agents[idx]);
  else { console.error(`Agent #${arg} not found. Use: npm run agents list`); process.exit(1); }
} else if (arg) {
  const match = agents.find(a => a.id === arg || a.title.toLowerCase() === arg.toLowerCase());
  if (match) launchAgent(match);
  else { console.error(`Agent "${arg}" not found. Use: npm run agents list`); process.exit(1); }
} else {
  listAgents(agents);
  if (agents.length > 0) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('  Launch agent #: ', answer => {
      rl.close();
      const idx = parseInt(answer.trim()) - 1;
      if (agents[idx]) launchAgent(agents[idx]);
      else console.log('Invalid selection');
    });
  }
}
