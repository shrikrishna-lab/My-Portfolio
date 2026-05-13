import { create } from 'zustand';

// data.json is imported at build time — edit it with `node panel.mjs`
import defaultData from '../../data.json';

let nextId = 100;
function genId() { return String(nextId++); }

function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

export const useStore = create((set, get) => ({
  profile: null,
  skills: [],
  projects: [],
  achievements: [],
  messages: [],
  loading: true,

  fetchAll: () => {
    set({
      ...clone(defaultData),
      loading: false,
    });
  },

  updateProfile: (updates) => {
    set((s) => ({ profile: { ...s.profile, ...updates } }));
  },

  addSkill: (skill) => {
    const newSkill = { ...skill, id: genId() };
    set((s) => ({ skills: [...s.skills, newSkill] }));
  },

  updateSkill: (id, updates) => {
    set((s) => ({ skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...updates } : sk)) }));
  },

  deleteSkill: (id) => {
    set((s) => ({ skills: s.skills.filter((sk) => sk.id !== id) }));
  },

  addProject: (project) => {
    const newProject = { ...project, id: genId() };
    set((s) => ({ projects: [...s.projects, newProject] }));
  },

  updateProject: (id, updates) => {
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)) }));
  },

  deleteProject: (id) => {
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
  },

  addAchievement: (achievement) => {
    const newAchievement = { ...achievement, id: genId() };
    set((s) => ({ achievements: [...s.achievements, newAchievement] }));
  },

  updateAchievement: (id, updates) => {
    set((s) => ({ achievements: s.achievements.map((a) => (a.id === id ? { ...a, ...updates } : a)) }));
  },

  deleteAchievement: (id) => {
    set((s) => ({ achievements: s.achievements.filter((a) => a.id !== id) }));
  },

  addMessage: (message) => {
    const newMessage = { ...message, id: genId(), createdAt: new Date().toISOString() };
    set((s) => ({ messages: [newMessage, ...s.messages] }));
  },

  deleteMessage: (id) => {
    set((s) => ({ messages: s.messages.filter((m) => m.id !== id) }));
  },

  uploadImage: async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ error: null, url: reader.result });
      reader.onerror = () => resolve({ error: { message: 'Failed to read file' }, url: null });
      reader.readAsDataURL(file);
    });
  },
}));
