import { create } from 'zustand';

const STORAGE_KEY = 'portfolio_data';

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      profile: state.profile,
      skills: state.skills,
      projects: state.projects,
      achievements: state.achievements,
      messages: state.messages,
    }));
  } catch {}
}

let nextId = 100;
function genId() { return String(nextId++); }

export const useStore = create((set, get) => ({
  profile: null,
  skills: [],
  projects: [],
  achievements: [],
  messages: [],
  loading: true,

  fetchAll: async () => {
    try {
      const res = await fetch('/data.json');
      if (res.ok) {
        const data = await res.json();
        set({ ...data, loading: false });
        save(data);
        return;
      }
    } catch {}
    const saved = loadSaved();
    if (saved) {
      set({ ...saved, loading: false });
      return;
    }
    set({ loading: false });
  },

  updateProfile: (updates) => {
    set((s) => {
      const profile = { ...s.profile, ...updates };
      save({ ...s, profile });
      return { profile };
    });
  },

  addSkill: (skill) => {
    const newSkill = { ...skill, id: genId() };
    set((s) => {
      const skills = [...s.skills, newSkill];
      save({ ...s, skills });
      return { skills };
    });
  },

  updateSkill: (id, updates) => {
    set((s) => {
      const skills = s.skills.map((sk) => (sk.id === id ? { ...sk, ...updates } : sk));
      save({ ...s, skills });
      return { skills };
    });
  },

  deleteSkill: (id) => {
    set((s) => {
      const skills = s.skills.filter((sk) => sk.id !== id);
      save({ ...s, skills });
      return { skills };
    });
  },

  addProject: (project) => {
    const newProject = { ...project, id: genId() };
    set((s) => {
      const projects = [...s.projects, newProject];
      save({ ...s, projects });
      return { projects };
    });
  },

  updateProject: (id, updates) => {
    set((s) => {
      const projects = s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
      save({ ...s, projects });
      return { projects };
    });
  },

  deleteProject: (id) => {
    set((s) => {
      const projects = s.projects.filter((p) => p.id !== id);
      save({ ...s, projects });
      return { projects };
    });
  },

  addAchievement: (achievement) => {
    const newAchievement = { ...achievement, id: genId() };
    set((s) => {
      const achievements = [...s.achievements, newAchievement];
      save({ ...s, achievements });
      return { achievements };
    });
  },

  updateAchievement: (id, updates) => {
    set((s) => {
      const achievements = s.achievements.map((a) => (a.id === id ? { ...a, ...updates } : a));
      save({ ...s, achievements });
      return { achievements };
    });
  },

  deleteAchievement: (id) => {
    set((s) => {
      const achievements = s.achievements.filter((a) => a.id !== id);
      save({ ...s, achievements });
      return { achievements };
    });
  },

  addMessage: (message) => {
    const newMessage = { ...message, id: genId(), createdAt: new Date().toISOString() };
    set((s) => {
      const messages = [newMessage, ...s.messages];
      save({ ...s, messages });
      return { messages };
    });
  },

  deleteMessage: (id) => {
    set((s) => {
      const messages = s.messages.filter((m) => m.id !== id);
      save({ ...s, messages });
      return { messages };
    });
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
