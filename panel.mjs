#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, 'public', 'data.json');

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

function readData() {
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n');
}

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

let nextId = 100;

function genId() {
  return String(nextId++);
}

function log(title, items, fields) {
  if (items.length === 0) {
    console.log(`  ${COLORS.dim}(empty)${COLORS.reset}`);
    return;
  }
  items.forEach((item, i) => {
    const label = fields.map((f) => `${COLORS.bold}${f}:${COLORS.reset} ${item[f] ?? ''}`).join('  ');
    console.log(`  ${COLORS.cyan}[${i}]${COLORS.reset} ${label}  ${COLORS.dim}(id: ${item.id})${COLORS.reset}`);
  });
}

function pick(items, field) {
  if (items.length === 0) return null;
  log('', items, [field]);
  return items;
}

// ---------- PROFILE ----------
async function editProfile() {
  const data = readData();
  const p = data.profile;
  console.log(`\n${COLORS.bold}${COLORS.yellow}Editing Profile${COLORS.reset}`);
  const fields = ['name', 'title', 'intro', 'aboutStory', 'startupVision', 'email', 'github', 'linkedin', 'twitter', 'characterImage'];
  for (const f of fields) {
    const val = await ask(`  ${f} [${p[f] || ''}]: `);
    if (val.trim()) p[f] = val.trim();
  }
  writeData(data);
  console.log(`  ${COLORS.green}Profile updated.${COLORS.reset}`);
}

// ---------- SKILLS ----------
async function listSkills() {
  const data = readData();
  console.log(`\n${COLORS.bold}${COLORS.yellow}Skills${COLORS.reset}`);
  log('', data.skills, ['name', 'category', 'icon']);
}

async function addSkill() {
  const data = readData();
  console.log(`\n${COLORS.bold}${COLORS.yellow}Add Skill${COLORS.reset}`);
  const name = await ask('  name: ');
  if (!name.trim()) { console.log(`  ${COLORS.red}Cancelled.${COLORS.reset}`); return; }
  const category = await ask('  category (Frontend/Backend/Tools) [Frontend]: ') || 'Frontend';
  const icon = await ask('  icon [Code]: ') || 'Code';
  data.skills.push({ id: genId(), name: name.trim(), icon, category, sortOrder: data.skills.length + 1 });
  writeData(data);
  console.log(`  ${COLORS.green}Skill added.${COLORS.reset}`);
}

async function editSkill() {
  const data = readData();
  if (data.skills.length === 0) { console.log(`  ${COLORS.dim}No skills to edit.${COLORS.reset}`); return; }
  pick(data.skills, 'name');
  const idx = parseInt(await ask('  index to edit: '));
  if (isNaN(idx) || idx < 0 || idx >= data.skills.length) { console.log(`  ${COLORS.red}Invalid.${COLORS.reset}`); return; }
  const s = data.skills[idx];
  const name = await ask(`  name [${s.name}]: `);
  const category = await ask(`  category [${s.category}]: `);
  const icon = await ask(`  icon [${s.icon}]: `);
  if (name.trim()) s.name = name.trim();
  if (category.trim()) s.category = category.trim();
  if (icon.trim()) s.icon = icon.trim();
  writeData(data);
  console.log(`  ${COLORS.green}Skill updated.${COLORS.reset}`);
}

async function deleteSkill() {
  const data = readData();
  if (data.skills.length === 0) { console.log(`  ${COLORS.dim}No skills to delete.${COLORS.reset}`); return; }
  pick(data.skills, 'name');
  const idx = parseInt(await ask('  index to delete: '));
  if (isNaN(idx) || idx < 0 || idx >= data.skills.length) { console.log(`  ${COLORS.red}Invalid.${COLORS.reset}`); return; }
  data.skills.splice(idx, 1);
  writeData(data);
  console.log(`  ${COLORS.green}Skill deleted.${COLORS.reset}`);
}

// ---------- PROJECTS ----------
async function listProjects() {
  const data = readData();
  console.log(`\n${COLORS.bold}${COLORS.yellow}Projects${COLORS.reset}`);
  log('', data.projects, ['title']);
}

async function addProject() {
  const data = readData();
  console.log(`\n${COLORS.bold}${COLORS.yellow}Add Project${COLORS.reset}`);
  const title = await ask('  title: ');
  if (!title.trim()) { console.log(`  ${COLORS.red}Cancelled.${COLORS.reset}`); return; }
  const description = await ask('  description: ');
  const techStack = await ask('  tech stack (comma separated): ');
  const imageUrl = await ask('  image URL: ');
  const githubUrl = await ask('  github URL: ');
  const liveUrl = await ask('  live URL: ');
  data.projects.push({ id: genId(), title: title.trim(), description, techStack, imageUrl, githubUrl, liveUrl, sortOrder: data.projects.length + 1 });
  writeData(data);
  console.log(`  ${COLORS.green}Project added.${COLORS.reset}`);
}

async function editProject() {
  const data = readData();
  if (data.projects.length === 0) { console.log(`  ${COLORS.dim}No projects to edit.${COLORS.reset}`); return; }
  pick(data.projects, 'title');
  const idx = parseInt(await ask('  index to edit: '));
  if (isNaN(idx) || idx < 0 || idx >= data.projects.length) { console.log(`  ${COLORS.red}Invalid.${COLORS.reset}`); return; }
  const p = data.projects[idx];
  const title = await ask(`  title [${p.title}]: `);
  const description = await ask(`  description [${p.description || ''}]: `);
  const techStack = await ask(`  tech stack [${p.techStack || ''}]: `);
  const imageUrl = await ask(`  image URL [${p.imageUrl || ''}]: `);
  const githubUrl = await ask(`  github URL [${p.githubUrl || ''}]: `);
  const liveUrl = await ask(`  live URL [${p.liveUrl || ''}]: `);
  if (title.trim()) p.title = title.trim();
  if (description.trim()) p.description = description.trim();
  if (techStack.trim()) p.techStack = techStack.trim();
  if (imageUrl.trim()) p.imageUrl = imageUrl.trim();
  if (githubUrl.trim()) p.githubUrl = githubUrl.trim();
  if (liveUrl.trim()) p.liveUrl = liveUrl.trim();
  writeData(data);
  console.log(`  ${COLORS.green}Project updated.${COLORS.reset}`);
}

async function deleteProject() {
  const data = readData();
  if (data.projects.length === 0) { console.log(`  ${COLORS.dim}No projects to delete.${COLORS.reset}`); return; }
  pick(data.projects, 'title');
  const idx = parseInt(await ask('  index to delete: '));
  if (isNaN(idx) || idx < 0 || idx >= data.projects.length) { console.log(`  ${COLORS.red}Invalid.${COLORS.reset}`); return; }
  data.projects.splice(idx, 1);
  writeData(data);
  console.log(`  ${COLORS.green}Project deleted.${COLORS.reset}`);
}

// ---------- ACHIEVEMENTS ----------
async function listAchievements() {
  const data = readData();
  console.log(`\n${COLORS.bold}${COLORS.yellow}Achievements${COLORS.reset}`);
  log('', data.achievements, ['title', 'date']);
}

async function addAchievement() {
  const data = readData();
  console.log(`\n${COLORS.bold}${COLORS.yellow}Add Achievement${COLORS.reset}`);
  const title = await ask('  title: ');
  if (!title.trim()) { console.log(`  ${COLORS.red}Cancelled.${COLORS.reset}`); return; }
  const date = await ask('  date/year: ');
  data.achievements.push({ id: genId(), title: title.trim(), date, sortOrder: data.achievements.length + 1, description: '', imageUrl: '' });
  writeData(data);
  console.log(`  ${COLORS.green}Achievement added.${COLORS.reset}`);
}

async function editAchievement() {
  const data = readData();
  if (data.achievements.length === 0) { console.log(`  ${COLORS.dim}No achievements to edit.${COLORS.reset}`); return; }
  pick(data.achievements, 'title');
  const idx = parseInt(await ask('  index to edit: '));
  if (isNaN(idx) || idx < 0 || idx >= data.achievements.length) { console.log(`  ${COLORS.red}Invalid.${COLORS.reset}`); return; }
  const a = data.achievements[idx];
  const title = await ask(`  title [${a.title}]: `);
  const date = await ask(`  date [${a.date || ''}]: `);
  if (title.trim()) a.title = title.trim();
  if (date.trim()) a.date = date.trim();
  writeData(data);
  console.log(`  ${COLORS.green}Achievement updated.${COLORS.reset}`);
}

async function deleteAchievement() {
  const data = readData();
  if (data.achievements.length === 0) { console.log(`  ${COLORS.dim}No achievements to delete.${COLORS.reset}`); return; }
  pick(data.achievements, 'title');
  const idx = parseInt(await ask('  index to delete: '));
  if (isNaN(idx) || idx < 0 || idx >= data.achievements.length) { console.log(`  ${COLORS.red}Invalid.${COLORS.reset}`); return; }
  data.achievements.splice(idx, 1);
  writeData(data);
  console.log(`  ${COLORS.green}Achievement deleted.${COLORS.reset}`);
}

// ---------- MESSAGES ----------
async function listMessages() {
  const data = readData();
  console.log(`\n${COLORS.bold}${COLORS.yellow}Messages${COLORS.reset}`);
  if (data.messages.length === 0) {
    console.log(`  ${COLORS.dim}(empty)${COLORS.reset}`);
    return;
  }
  data.messages.forEach((m, i) => {
    console.log(`  ${COLORS.cyan}[${i}]${COLORS.reset} ${COLORS.bold}${m.name}${COLORS.reset} <${m.email}>  ${COLORS.dim}(${m.createdAt ? new Date(m.createdAt).toLocaleString() : ''})${COLORS.reset}`);
    console.log(`      ${m.message}`);
  });
}

async function deleteMessage() {
  const data = readData();
  if (data.messages.length === 0) { console.log(`  ${COLORS.dim}No messages to delete.${COLORS.reset}`); return; }
  data.messages.forEach((m, i) => {
    console.log(`  ${COLORS.cyan}[${i}]${COLORS.reset} ${COLORS.bold}${m.name}${COLORS.reset}: ${m.message.substring(0, 60)}`);
  });
  const idx = parseInt(await ask('  index to delete: '));
  if (isNaN(idx) || idx < 0 || idx >= data.messages.length) { console.log(`  ${COLORS.red}Invalid.${COLORS.reset}`); return; }
  data.messages.splice(idx, 1);
  writeData(data);
  console.log(`  ${COLORS.green}Message deleted.${COLORS.reset}`);
}

// ---------- PREVIEW ----------
function preview() {
  const data = readData();
  console.log(`\n${COLORS.bold}${COLORS.yellow}Current Data Preview${COLORS.reset}`);
  console.log(`  ${COLORS.bold}Profile:${COLORS.reset} ${data.profile.name} — ${data.profile.title}`);
  console.log(`  ${COLORS.bold}Skills:${COLORS.reset} ${data.skills.length} items`);
  console.log(`  ${COLORS.bold}Projects:${COLORS.reset} ${data.projects.length} items`);
  console.log(`  ${COLORS.bold}Achievements:${COLORS.reset} ${data.achievements.length} items`);
  console.log(`  ${COLORS.bold}Messages:${COLORS.reset} ${data.messages.length} items`);
}

// ---------- RESET ----------
function resetData() {
  const fresh = {
    profile: {
      id: 'default', name: 'Alex Dev', title: 'IT Student \u2022 Web Developer \u2022 Startup Builder',
      intro: 'I build modern web applications and explore the startup ecosystem.',
      aboutStory: 'I started my journey with a deep curiosity for how things work on the internet. Now I build full-stack web applications and am currently exploring my startup idea.',
      startupVision: 'DevConnect - An all-in-one platform for developers, students, and companies.',
      email: 'alex@devconnect.com', github: 'https://github.com', linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      characterImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974',
    },
    skills: [
      { id: '1', name: 'React', icon: 'Code', category: 'Frontend', sortOrder: 1 },
      { id: '2', name: 'TailwindCSS', icon: 'Brush', category: 'Frontend', sortOrder: 2 },
      { id: '3', name: 'Node.js', icon: 'Server', category: 'Backend', sortOrder: 3 },
      { id: '4', name: 'PostgreSQL', icon: 'Database', category: 'Backend', sortOrder: 4 },
    ],
    projects: [
      { id: '1', title: 'DevConnect Platform', description: 'A comprehensive developer platform for startups and students.', techStack: 'React, Supabase, Tailwind', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070', githubUrl: 'https://github.com', liveUrl: 'https://example.com', sortOrder: 1 },
      { id: '2', title: 'Portfolio CMS', description: 'A dynamic portfolio with a built-in admin dashboard.', techStack: 'React, Vite, Zustand', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015', githubUrl: 'https://github.com', liveUrl: 'https://example.com', sortOrder: 2 },
    ],
    achievements: [
      { id: '1', title: '1st Place Global Hackathon', date: '2025', sortOrder: 1, description: '', imageUrl: '' },
      { id: '2', title: 'AWS Certified Developer', date: '2024', sortOrder: 2, description: '', imageUrl: '' },
    ],
    messages: [],
  };
  writeData(fresh);
  console.log(`  ${COLORS.green}Data reset to defaults.${COLORS.reset}`);
}

// ---------- MAIN ----------
async function main() {
  console.log(`\n${COLORS.bold}${COLORS.magenta}  Portfolio Panel${COLORS.reset}  ${COLORS.dim}Manage your portfolio from the terminal${COLORS.reset}\n`);

  const actions = [
    { label: 'Edit Profile', action: editProfile },
    { label: 'List Skills', action: listSkills },
    { label: 'Add Skill', action: addSkill },
    { label: 'Edit Skill', action: editSkill },
    { label: 'Delete Skill', action: deleteSkill },
    { label: 'List Projects', action: listProjects },
    { label: 'Add Project', action: addProject },
    { label: 'Edit Project', action: editProject },
    { label: 'Delete Project', action: deleteProject },
    { label: 'List Achievements', action: listAchievements },
    { label: 'Add Achievement', action: addAchievement },
    { label: 'Edit Achievement', action: editAchievement },
    { label: 'Delete Achievement', action: deleteAchievement },
    { label: 'List Messages', action: listMessages },
    { label: 'Delete Message', action: deleteMessage },
    { label: 'Preview Summary', action: preview },
    { label: 'Reset to Defaults', action: resetData },
    { label: 'Exit', action: null },
  ];

  while (true) {
    console.log(`\n${COLORS.bold}${COLORS.cyan}  ── Menu ──────────────────────${COLORS.reset}`);
    actions.forEach((a, i) => {
      const exit = a.label === 'Exit';
      console.log(`  ${exit ? COLORS.red : COLORS.cyan}[${String(i).padStart(2, ' ')}]${COLORS.reset} ${exit ? COLORS.red : ''}${a.label}${COLORS.reset}`);
    });
    console.log(`  ${COLORS.cyan}────────────────────────────────${COLORS.reset}`);

    const choice = await ask(`\n  ${COLORS.bold}Select option${COLORS.reset}: `);
    const idx = parseInt(choice);
    if (isNaN(idx) || idx < 0 || idx >= actions.length) {
      console.log(`  ${COLORS.red}Invalid option.${COLORS.reset}`);
      continue;
    }
    const selected = actions[idx];
    if (!selected.action) {
      console.log(`\n  ${COLORS.green}Goodbye!${COLORS.reset}\n`);
      rl.close();
      return;
    }
    await selected.action();
  }
}

main().catch((err) => {
  console.error(err);
  rl.close();
});
