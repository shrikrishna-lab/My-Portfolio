import { create } from 'zustand';

const ADMIN_EMAIL = 'handibagshrikrishna@gmail.com';
const ADMIN_PASSWORD = 'shrikrishna@admin77';

const STORAGE_KEY = 'portfolio_data';
const SESSION_KEY = 'portfolio_session';

const DEFAULT_DATA = {
  profile: {
    id: 'default',
    name: 'Alex Dev',
    title: 'IT Student \u2022 Web Developer \u2022 Startup Builder',
    intro: 'I build modern web applications and explore the startup ecosystem.',
    aboutStory: 'I started my journey with a deep curiosity for how things work on the internet. Now I build full-stack web applications and am currently exploring my startup idea.',
    startupVision: 'DevConnect - An all-in-one platform for developers, students, and companies.',
    email: 'alex@devconnect.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
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
    { id: '1', title: '1st Place Global Hackathon', date: '2025', sortOrder: 1 },
    { id: '2', title: 'AWS Certified Developer', date: '2024', sortOrder: 2 },
  ],
  messages: [],
};

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) { /* ignore */ }
  return null;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

function loadSession() {
  try {
    return localStorage.getItem(SESSION_KEY) === 'true';
  } catch (e) { /* ignore */ }
  return false;
}

function saveSession(authenticated) {
  try {
    if (authenticated) {
      localStorage.setItem(SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (e) { /* ignore */ }
}

let nextId = 100;

function genId() {
  return String(nextId++);
}

export const useStore = create((set, get) => ({
  profile: null,
  skills: [],
  projects: [],
  achievements: [],
  messages: [],
  loading: true,
  auth: {
    isAuthenticated: false,
    user: null,
  },

  fetchAll: () => {
    const stored = loadData();
    if (stored) {
      set({
        profile: stored.profile,
        skills: stored.skills,
        projects: stored.projects,
        achievements: stored.achievements,
        messages: stored.messages,
        loading: false,
      });
    } else {
      set({
        ...DEFAULT_DATA,
        loading: false,
      });
      saveData(DEFAULT_DATA);
    }
  },

  login: async (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      set({ auth: { isAuthenticated: true, user: { email } } });
      saveSession(true);
      return { success: true };
    }
    return { success: false, error: 'Access denied. Check credentials.' };
  },

  logout: () => {
    set({ auth: { isAuthenticated: false, user: null } });
    saveSession(false);
  },

  checkSession: () => {
    const authenticated = loadSession();
    if (authenticated) {
      set({ auth: { isAuthenticated: true, user: { email: ADMIN_EMAIL } } });
    }
  },

  updateProfile: (updates) => {
    const profile = get().profile;
    if (!profile) return { error: 'No profile' };
    const updated = { ...profile, ...updates };
    set({ profile: updated });
    const state = get();
    saveData({
      profile: updated,
      skills: state.skills,
      projects: state.projects,
      achievements: state.achievements,
      messages: state.messages,
    });
    return { error: null };
  },

  addSkill: (skill) => {
    const newSkill = { ...skill, id: genId() };
    set((s) => {
      const skills = [...s.skills, newSkill];
      saveData({ ...s, skills });
      return { skills };
    });
    return { error: null };
  },

  updateSkill: (id, updates) => {
    set((s) => {
      const skills = s.skills.map((sk) => (sk.id === id ? { ...sk, ...updates } : sk));
      saveData({ ...s, skills });
      return { skills };
    });
    return { error: null };
  },

  deleteSkill: (id) => {
    set((s) => {
      const skills = s.skills.filter((sk) => sk.id !== id);
      saveData({ ...s, skills });
      return { skills };
    });
  },

  addProject: (project) => {
    const newProject = { ...project, id: genId() };
    set((s) => {
      const projects = [...s.projects, newProject];
      saveData({ ...s, projects });
      return { projects };
    });
    return { error: null };
  },

  updateProject: (id, updates) => {
    set((s) => {
      const projects = s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveData({ ...s, projects });
      return { projects };
    });
    return { error: null };
  },

  deleteProject: (id) => {
    set((s) => {
      const projects = s.projects.filter((p) => p.id !== id);
      saveData({ ...s, projects });
      return { projects };
    });
  },

  addAchievement: (achievement) => {
    const newAchievement = { ...achievement, id: genId() };
    set((s) => {
      const achievements = [...s.achievements, newAchievement];
      saveData({ ...s, achievements });
      return { achievements };
    });
    return { error: null };
  },

  updateAchievement: (id, updates) => {
    set((s) => {
      const achievements = s.achievements.map((a) => (a.id === id ? { ...a, ...updates } : a));
      saveData({ ...s, achievements });
      return { achievements };
    });
    return { error: null };
  },

  deleteAchievement: (id) => {
    set((s) => {
      const achievements = s.achievements.filter((a) => a.id !== id);
      saveData({ ...s, achievements });
      return { achievements };
    });
  },

  addMessage: (message) => {
    const newMessage = {
      ...message,
      id: genId(),
      createdAt: new Date().toISOString(),
    };
    set((s) => {
      const messages = [newMessage, ...s.messages];
      saveData({ ...s, messages });
      return { messages };
    });
    return { error: null };
  },

  deleteMessage: (id) => {
    set((s) => {
      const messages = s.messages.filter((m) => m.id !== id);
      saveData({ ...s, messages });
      return { messages };
    });
  },

  uploadImage: async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ error: null, url: reader.result });
      };
      reader.onerror = () => {
        resolve({ error: { message: 'Failed to read file' }, url: null });
      };
      reader.readAsDataURL(file);
    });
  },
}));
