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
      nowLogs: state.nowLogs,
      sandboxIdeas: state.sandboxIdeas,
      currentProjects: state.currentProjects,
      learningPaths: state.learningPaths,
      activities: state.activities,
      experience: state.experience,
      education: state.education,
    }));
  } catch {}
}

let nextId = 100;
function genId() { return String(nextId++); }

export const useStore = create((set, get) => ({
  getGithubToken: () => { try { return localStorage.getItem('github_token') || ''; } catch { return ''; } },
  profile: null,
  skills: [],
  projects: [],
  achievements: [],
  messages: [],
  nowLogs: [],
  sandboxIdeas: [],
  currentProjects: [],
  learningPaths: [],
  activities: [],
  experience: [],
  education: [],
  loading: true,

  fetchAll: async () => {
    try {
      const res = await fetch(`/data.json?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        set({
          profile: data.profile || null,
          skills: data.skills || [],
          projects: data.projects || [],
          achievements: data.achievements || [],
          messages: data.messages || [],
          nowLogs: data.nowLogs || [],
          sandboxIdeas: data.sandboxIdeas || [],
          currentProjects: data.currentProjects || [],
          learningPaths: data.learningPaths || [],
          activities: data.activities || [],
          experience: data.experience || [],
          education: data.education || [],
          loading: false
        });
        save(data);
        return;
      }
    } catch {}
    const saved = loadSaved();
    if (saved) {
      set({
        profile: saved.profile || null,
        skills: saved.skills || [],
        projects: saved.projects || [],
        achievements: saved.achievements || [],
        messages: saved.messages || [],
        nowLogs: saved.nowLogs || [],
        sandboxIdeas: saved.sandboxIdeas || [],
        currentProjects: saved.currentProjects || [],
        learningPaths: saved.learningPaths || [],
        activities: saved.activities || [],
        experience: saved.experience || [],
        education: saved.education || [],
        loading: false
      });
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

  addMessage: async (message) => {
    const newMessage = { ...message, id: genId(), createdAt: new Date().toISOString() };
    set((s) => {
      const messages = [newMessage, ...s.messages];
      save({ ...s, messages });
      return { messages };
    });
    const token = get().getGithubToken?.();
    if (token) {
      try {
        const state = get();
        const data = {
          profile: state.profile,
          skills: state.skills,
          projects: state.projects,
          achievements: state.achievements,
          messages: state.messages,
          nowLogs: state.nowLogs,
          sandboxIdeas: state.sandboxIdeas,
          currentProjects: state.currentProjects,
          learningPaths: state.learningPaths,
          activities: state.activities,
          experience: state.experience,
          education: state.education,
        };
        const repo = 'shrikrishna-lab/My-Portfolio', path = 'public/data.json', branch = 'main';
        const headers = { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' };
        const existing = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, { headers }).then(r => r.json());
        const sha = existing.sha;
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2) + '\n')));
        await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, { method: 'PUT', headers, body: JSON.stringify({ message: 'New message from contact form', content, sha, branch }) });
      } catch {}
    }
  },

  fetchMessagesFromGitHub: async () => {
    try {
      const res = await fetch('https://raw.githubusercontent.com/shrikrishna-lab/My-Portfolio/main/public/data.json');
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          set((s) => {
            const existingIds = new Set(s.messages.map(m => m.id));
            const merged = [...s.messages];
            for (const msg of data.messages) {
              if (!existingIds.has(msg.id)) merged.push(msg);
            }
            merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            save({ ...s, messages: merged });
            return { messages: merged };
          });
        }
      }
    } catch {}
  },

  deleteMessage: async (id) => {
    set((s) => {
      const messages = s.messages.filter((m) => m.id !== id);
      save({ ...s, messages });
      return { messages };
    });
    const token = get().getGithubToken?.();
    if (token) {
      try {
        const state = get();
        const data = {
          profile: state.profile,
          skills: state.skills,
          projects: state.projects,
          achievements: state.achievements,
          messages: state.messages,
          nowLogs: state.nowLogs,
          sandboxIdeas: state.sandboxIdeas,
          currentProjects: state.currentProjects,
          learningPaths: state.learningPaths,
          activities: state.activities,
          experience: state.experience,
          education: state.education,
        };
        const repo = 'shrikrishna-lab/My-Portfolio', path = 'public/data.json', branch = 'main';
        const headers = { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' };
        const existing = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, { headers }).then(r => r.json());
        const sha = existing.sha;
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2) + '\n')));
        await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, { method: 'PUT', headers, body: JSON.stringify({ message: 'Delete message via admin panel', content, sha, branch }) });
      } catch {}
    }
  },

  /* ── NOW LOGS (DEVLOG) CRUD ── */
  addNowLog: (log) => {
    const newLog = { ...log, id: genId() };
    set((s) => {
      const nowLogs = [newLog, ...s.nowLogs];
      save({ ...s, nowLogs });
      return { nowLogs };
    });
  },
  updateNowLog: (id, updates) => {
    set((s) => {
      const nowLogs = s.nowLogs.map((l) => (l.id === id ? { ...l, ...updates } : l));
      save({ ...s, nowLogs });
      return { nowLogs };
    });
  },
  deleteNowLog: (id) => {
    set((s) => {
      const nowLogs = s.nowLogs.filter((l) => l.id !== id);
      save({ ...s, nowLogs });
      return { nowLogs };
    });
  },

  /* ── SANDBOX IDEAS CRUD ── */
  addSandboxIdea: (idea) => {
    const newIdea = { ...idea, id: genId() };
    set((s) => {
      const sandboxIdeas = [newIdea, ...s.sandboxIdeas];
      save({ ...s, sandboxIdeas });
      return { sandboxIdeas };
    });
  },
  updateSandboxIdea: (id, updates) => {
    set((s) => {
      const sandboxIdeas = s.sandboxIdeas.map((i) => (i.id === id ? { ...i, ...updates } : i));
      save({ ...s, sandboxIdeas });
      return { sandboxIdeas };
    });
  },
  deleteSandboxIdea: (id) => {
    set((s) => {
      const sandboxIdeas = s.sandboxIdeas.filter((i) => i.id !== id);
      save({ ...s, sandboxIdeas });
      return { sandboxIdeas };
    });
  },

  /* ── CURRENT PROJECTS CRUD ── */
  addCurrentProject: (project) => {
    const newProject = { ...project, id: genId() };
    set((s) => {
      const currentProjects = [...s.currentProjects, newProject];
      save({ ...s, currentProjects });
      return { currentProjects };
    });
  },
  updateCurrentProject: (id, updates) => {
    set((s) => {
      const currentProjects = s.currentProjects.map((p) => (p.id === id ? { ...p, ...updates } : p));
      save({ ...s, currentProjects });
      return { currentProjects };
    });
  },
  deleteCurrentProject: (id) => {
    set((s) => {
      const currentProjects = s.currentProjects.filter((p) => p.id !== id);
      save({ ...s, currentProjects });
      return { currentProjects };
    });
  },

  /* ── LEARNING PATHS CRUD ── */
  addLearningPath: (path) => {
    const newPath = { ...path, id: genId() };
    set((s) => {
      const learningPaths = [...s.learningPaths, newPath];
      save({ ...s, learningPaths });
      return { learningPaths };
    });
  },
  updateLearningPath: (id, updates) => {
    set((s) => {
      const learningPaths = s.learningPaths.map((p) => (p.id === id ? { ...p, ...updates } : p));
      save({ ...s, learningPaths });
      return { learningPaths };
    });
  },
  deleteLearningPath: (id) => {
    set((s) => {
      const learningPaths = s.learningPaths.filter((p) => p.id !== id);
      save({ ...s, learningPaths });
      return { learningPaths };
    });
  },

  /* ── ACTIVITIES CRUD ── */
  addActivity: (activity) => {
    const newActivity = { ...activity, id: genId() };
    set((s) => {
      const activities = [newActivity, ...s.activities];
      save({ ...s, activities });
      return { activities };
    });
  },
  updateActivity: (id, updates) => {
    set((s) => {
      const activities = s.activities.map((a) => (a.id === id ? { ...a, ...updates } : a));
      save({ ...s, activities });
      return { activities };
    });
  },
  deleteActivity: (id) => {
    set((s) => {
      const activities = s.activities.filter((a) => a.id !== id);
      save({ ...s, activities });
      return { activities };
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

  /* ── EXPERIENCE CRUD ── */
  addExperience: (exp) => {
    const newExp = { ...exp, id: genId() };
    set((s) => {
      const experience = [...s.experience, newExp];
      save({ ...s, experience });
      return { experience };
    });
  },
  updateExperience: (id, updates) => {
    set((s) => {
      const experience = s.experience.map((e) => (e.id === id ? { ...e, ...updates } : e));
      save({ ...s, experience });
      return { experience };
    });
  },
  deleteExperience: (id) => {
    set((s) => {
      const experience = s.experience.filter((e) => e.id !== id);
      save({ ...s, experience });
      return { experience };
    });
  },

  /* ── EDUCATION CRUD ── */
  addEducation: (edu) => {
    const newEdu = { ...edu, id: genId() };
    set((s) => {
      const education = [...s.education, newEdu];
      save({ ...s, education });
      return { education };
    });
  },
  updateEducation: (id, updates) => {
    set((s) => {
      const education = s.education.map((e) => (e.id === id ? { ...e, ...updates } : e));
      save({ ...s, education });
      return { education };
    });
  },
  deleteEducation: (id) => {
    set((s) => {
      const education = s.education.filter((e) => e.id !== id);
      save({ ...s, education });
      return { education };
    });
  },
  setExperience: (experience) => {
    set((s) => {
      save({ ...s, experience });
      return { experience };
    });
  },
  setEducation: (education) => {
    set((s) => {
      save({ ...s, education });
      return { education };
    });
  },
  setActivities: (activities) => {
    set((s) => {
      save({ ...s, activities });
      return { activities };
    });
  },
}));
