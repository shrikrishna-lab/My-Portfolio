import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useStore } from '@/lib/store';
import { Link } from 'react-router-dom';
import {
    Skull, Lightbulb, Send, ArrowLeft, Sparkles, Hammer, Milestone,
    ExternalLink, Github, ChevronDown, ChevronUp, CheckCircle2, Circle,
    BookOpen, MapPin, Calendar, Image, Tag, Trophy, XCircle, Clock,
    Pause, Flame, GraduationCap, Globe, Camera, FileText, Link2,
    ChevronLeft, ChevronRight, Zap, ListChecks, Heart, MessageCircle,
    Share2, ThumbsUp, Repeat2, Play, MoreHorizontal, Grid, Instagram,
    Youtube, Linkedin, Twitter, Star, GitFork, Code2, Briefcase, Building
} from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

/* ── Status Color Map ── */
const statusStyles = {
    active:        { bg: 'bg-[#FFB800]/10', border: 'border-[#FFB800]/30', text: 'text-[#FFB800]', dot: 'bg-[#FFB800]' },
    'in progress': { bg: 'bg-[#FFB800]/10', border: 'border-[#FFB800]/30', text: 'text-[#FFB800]', dot: 'bg-[#FFB800]' },
    completed:     { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    success:       { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    finished:      { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    paused:        { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-500', dot: 'bg-orange-400' },
    pending:       { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-500', dot: 'bg-blue-400' },
    registered:    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-500', dot: 'bg-purple-400' },
    buried:        { bg: 'bg-neutral-100', border: 'border-neutral-300', text: 'text-neutral-400', dot: 'bg-neutral-400' },
    failed:        { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-500', dot: 'bg-red-400' },
    brainstorming: { bg: 'bg-[#3AA8F5]/10', border: 'border-[#3AA8F5]/30', text: 'text-[#3AA8F5]', dot: 'bg-[#3AA8F5]' },
};
const getStatus = (s) => statusStyles[(s || '').toLowerCase()] || statusStyles.pending;

const statusIcons = {
    active: Hammer, 'in progress': Flame, completed: CheckCircle2, success: Trophy,
    finished: CheckCircle2, paused: Pause, pending: Clock, registered: Calendar,
    buried: Skull, failed: XCircle, brainstorming: Lightbulb,
};
const getStatusIcon = (s) => statusIcons[(s || '').toLowerCase()] || Circle;

/* ── Badge Component ── */
function StatusBadge({ status }) {
    const st = getStatus(status);
    const Icon = getStatusIcon(status);
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider border ${st.bg} ${st.border} ${st.text} whitespace-nowrap`}>
            <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {status}
        </span>
    );
}

/* ── Progress Bar ── */
function ProgressBar({ percent, size = 'md' }) {
    const h = size === 'sm' ? 'h-1.5' : 'h-2.5';
    return (
        <div className={`w-full ${h} bg-neutral-200 rounded-full overflow-hidden`}>
            <motion.div
                className={`${h} rounded-full ${percent === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#FFB800] to-[#ffcc33]'}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${percent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </div>
    );
}

/* ── Section Header ── */
function SectionHeader({ icon: Icon, label, title, color = '#18112E' }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-3">
            <div className="flex items-center gap-2.5">
                <span className="w-8 h-1 rounded-full" style={{ background: color }} />
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color }}>
                    <Icon className="w-4 h-4" /> {label}
                </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#18112E] uppercase tracking-tight">{title}</h2>
        </motion.div>
    );
}

/* ── Circular Progress Ring (for mobile learning tracker) ── */
function ProgressRing({ percent, size = 56, strokeWidth = 4 }) {
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percent / 100) * circ;
    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e5e5" strokeWidth={strokeWidth} />
            <motion.circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={percent === 100 ? '#10b981' : '#FFB800'}
                strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
            />
        </svg>
    );
}

/* ── Mobile Learning Card (swipeable carousel item) ── */
function MobileLearningCard({ lp, isActive, onClick }) {
    const completed = lp.topicsCompleted?.length || 0;
    const total = completed + (lp.topicsPending?.length || 0);

    return (
        <motion.div
            layout
            onClick={onClick}
            className={`bg-white border-2 rounded-[20px] overflow-hidden transition-all duration-300 cursor-pointer ${
                isActive 
                    ? 'border-[#3AA8F5] shadow-[0_8px_30px_rgba(58,168,245,0.15)]' 
                    : 'border-[#18112E] shadow-[4px_4px_0_#18112E] hover:-translate-y-1'
            }`}
        >
            {/* Header */}
            <div className="p-4 pb-3">
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <ProgressRing percent={lp.progress} size={52} strokeWidth={3.5} />
                        <span className="absolute inset-0 flex items-center justify-center text-lg">{lp.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-[#18112E] tracking-tight truncate">{lp.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <StatusBadge status={lp.status} />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                    <span>{completed}/{total} topics</span>
                    <span>{lp.progress}%</span>
                </div>
                <ProgressBar percent={lp.progress} size="sm" />
            </div>

            {/* Expandable Content */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3 border-t border-neutral-100 pt-3">
                            {/* Topics Mini Grid */}
                            <div className="grid grid-cols-2 gap-1.5">
                                {(lp.topicsCompleted || []).slice(0, 4).map((t, i) => (
                                    <div key={`c-${i}`} className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 bg-emerald-50 rounded-lg px-2 py-1.5">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                        <span className="truncate line-through opacity-60">{t}</span>
                                    </div>
                                ))}
                                {(lp.topicsPending || []).slice(0, 4).map((t, i) => (
                                    <div key={`p-${i}`} className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 bg-neutral-50 rounded-lg px-2 py-1.5">
                                        <Circle className="w-3 h-3 text-neutral-300 shrink-0" />
                                        <span className="truncate">{t}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Resources */}
                            {lp.resources?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {lp.resources.map((r, i) => (
                                        <a key={i} href={r.url} target="_blank" rel="noreferrer"
                                            className="px-2 py-1 text-[10px] font-bold rounded-lg bg-[#3AA8F5]/10 border border-[#3AA8F5]/20 text-[#3AA8F5] hover:bg-[#3AA8F5] hover:text-white transition-colors">
                                            {r.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                            {lp.notes && (
                                <p className="text-[11px] font-bold text-neutral-400 italic leading-relaxed">📝 {lp.notes}</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ── Enhanced Devlog Entry ── */
function DevlogEntry({ log }) {
    const [expanded, setExpanded] = useState(false);
    const hasDetails = log.documentation || (log.photos?.length > 0) || (log.changes?.length > 0) || (log.links?.length > 0);

    return (
        <div className="relative">
            <div className="absolute -left-[35px] sm:-left-[43px] top-0.5 w-6 h-6 rounded-full bg-white border-2 border-[#18112E] flex items-center justify-center text-xs shadow-sm">
                {log.type.toLowerCase() === 'update' && '⚙️'}
                {log.type.toLowerCase() === 'feature' && '✨'}
                {log.type.toLowerCase() === 'learning' && '📚'}
            </div>
            <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-black uppercase text-neutral-400 tracking-wider">{log.date}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase border border-[#18112E] ${log.type.toLowerCase() === 'update' ? 'bg-[#FFB800] text-[#18112E]' : log.type.toLowerCase() === 'feature' ? 'bg-[#3AA8F5] text-white' : 'bg-[#18112E] text-white'}`}>{log.type}</span>
                    {hasDetails && (
                        <button 
                            onClick={() => setExpanded(!expanded)}
                            className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-neutral-100 text-neutral-500 hover:bg-[#18112E] hover:text-white transition-colors border border-neutral-200"
                        >
                            <FileText className="w-3 h-3" />
                            {expanded ? 'Less' : 'Details'}
                            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                    )}
                </div>
                <p className="text-neutral-700 font-bold text-sm leading-relaxed">{log.content}</p>

                {/* Expandable Details */}
                <AnimatePresence>
                    {expanded && hasDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-2 space-y-3 p-3 sm:p-4 bg-[#F8F9FA] rounded-2xl border border-neutral-200">
                                {/* Documentation */}
                                {log.documentation && (
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5" /> Documentation
                                        </h4>
                                        <p className="text-xs sm:text-sm font-medium text-neutral-600 leading-relaxed">{log.documentation}</p>
                                    </div>
                                )}

                                {/* Changes List */}
                                {log.changes?.length > 0 && (
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <ListChecks className="w-3.5 h-3.5" /> Changes
                                        </h4>
                                        <ul className="space-y-1">
                                            {log.changes.map((c, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm font-bold text-neutral-500">
                                                    <span className="text-emerald-500 mt-0.5">▸</span> {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Photos */}
                                {log.photos?.length > 0 && (
                                    <div className="space-y-1.5">
                                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Camera className="w-3.5 h-3.5" /> Screenshots
                                        </h4>
                                        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
                                            {log.photos.map((p, i) => (
                                                <img key={i} src={p} alt="" className="w-48 sm:w-64 h-28 sm:h-36 rounded-xl object-cover border-2 border-[#18112E]/10 shrink-0" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {log.links?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {log.links.map((lnk, i) => (
                                            <a key={i} href={lnk.url} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg bg-white border border-neutral-200 text-[#3AA8F5] hover:bg-[#3AA8F5] hover:text-white hover:border-[#3AA8F5] transition-colors shadow-sm">
                                                <Link2 className="w-3 h-3" /> {lnk.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════ */
export default function Sandbox() {
    const profile = useStore((s) => s.profile);
    const nowLogs = useStore((s) => s.nowLogs) || [];
    const sandboxIdeas = useStore((s) => s.sandboxIdeas) || [];
    const currentProjects = useStore((s) => s.currentProjects) || [];
    const learningPaths = useStore((s) => s.learningPaths) || [];
    const activities = useStore((s) => s.activities) || [];
    const experience = useStore((s) => s.experience) || [];
    const education = useStore((s) => s.education) || [];
    const achievements = useStore((s) => s.achievements) || [];
    const addMessage = useStore((s) => s.addMessage);

    const [ideaTab, setIdeaTab] = useState('all');
    const [activityFilter, setActivityFilter] = useState('all');
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activeLearning, setActiveLearning] = useState(null);
    const [form, setForm] = useState({ name: '', company: '', idea: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    // Social Feed states
    const [socialTab, setSocialTab] = useState(null); // dynamic default
    const [likedStates, setLikedStates] = useState({}); // e.g., { act1: { liked: true, count: 43 } }
    const [socialComments, setSocialComments] = useState({}); // user added comments to posts

    // GitHub fetching state with cache fallback
    const [ghProfile, setGhProfile] = useState(() => {
        try {
            const cached = localStorage.getItem('gh_profile_cache');
            return cached ? JSON.parse(cached) : null;
        } catch { return null; }
    });
    const [ghRepos, setGhRepos] = useState(() => {
        try {
            const cached = localStorage.getItem('gh_repos_cache');
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });
    const [ghEvents, setGhEvents] = useState(() => {
        try {
            const cached = localStorage.getItem('gh_events_cache');
            return cached ? JSON.parse(cached) : [];
        } catch { return []; }
    });
    const [ghLoading, setGhLoading] = useState(false);
    const [ghError, setGhError] = useState(null);

    // No twitter ref needed

    const learningScrollRef = useRef(null);
    const projectsScrollRef = useRef(null);
    const activitiesScrollRef = useRef(null);

    // Filter active tabs based on profile.socialTabs settings
    const socialTabsConfig = profile?.socialTabs || { snapdude: true, linkedin: true, youtube: false, github: true, carousel: true };

    const allTabs = [
        { id: 'snapdude', label: 'Snap Dude', icon: Camera, activeColor: 'bg-[#FFFC00] text-[#18112E]', configKey: 'snapdude' },
        { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, activeColor: 'bg-[#0A66C2] text-white', configKey: 'linkedin' },
        { id: 'github', label: 'GitHub', icon: Github, activeColor: 'bg-neutral-800 text-white', configKey: 'github' },
        { id: 'youtube', label: 'YouTube', icon: Youtube, activeColor: 'bg-[#FF0000] text-white', configKey: 'youtube' },
        { id: 'carousel', label: 'Feed', icon: Globe, activeColor: 'bg-[#18112E] text-white', configKey: 'carousel' }
    ];

    const activeTabs = allTabs.filter(t => socialTabsConfig[t.configKey] !== false);
    const activeSocialTab = socialTab || activeTabs[0]?.id || 'snapdude';

    // Derive real social handles from profile URLs using robust regex
    const ghUsername = profile?.github
        ? profile.github.trim().replace(/https?:\/\/(www\.)?github\.com\//i, '').split(/[/?#]/)[0]
        : 'shrikrishna-lab';
    const snapdudeHandle = profile?.snapdude
        ? profile.snapdude.trim().replace(/https?:\/\/(www\.)?(instagram\.com|snapdude\.com)\//i, '').split(/[/?#]/)[0]
        : '';

    // Fetch GitHub profile + repos + events on mount with auth headers + cache updates
    useEffect(() => {
        if (!profile?.github) return;

        const token = (() => {
            try { return localStorage.getItem('github_token') || ''; } catch { return ''; }
        })();
        const headers = token ? { Authorization: `token ${token}` } : {};

        // Fetch profile
        fetch(`https://api.github.com/users/${ghUsername}`, { headers })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error(`Profile fetch status: ${res.status}`);
            })
            .then(data => {
                if (data) {
                    setGhProfile(data);
                    try { localStorage.setItem('gh_profile_cache', JSON.stringify(data)); } catch {}
                }
            })
            .catch(() => {});

        // Fetch repos (sorted by recently updated)
        fetch(`https://api.github.com/users/${ghUsername}/repos?sort=updated&per_page=6&direction=desc`, { headers })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error(`Repos fetch status: ${res.status}`);
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setGhRepos(data);
                    try { localStorage.setItem('gh_repos_cache', JSON.stringify(data)); } catch {}
                }
            })
            .catch(() => {});

        // Fetch events
        setGhLoading(ghEvents.length === 0);
        fetch(`https://api.github.com/users/${ghUsername}/events?per_page=10`, { headers })
            .then(res => {
                if (res.status === 403) {
                    throw new Error('API Rate Limit Exceeded. Please add a GitHub token in the Admin Panel to increase limits.');
                }
                if (!res.ok) throw new Error(`Events fetch status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const events = Array.isArray(data) ? data.slice(0, 10) : [];
                setGhEvents(events);
                if (events.length > 0) {
                    try { localStorage.setItem('gh_events_cache', JSON.stringify(events)); } catch {}
                }
                setGhLoading(false);
                setGhError(null);
            })
            .catch(err => {
                if (ghEvents.length === 0) {
                    setGhError(err.message);
                } else {
                    console.warn(err.message);
                }
                setGhLoading(false);
            });
    }, [profile?.github, ghUsername]); // eslint-disable-line react-hooks/exhaustive-deps

    // Twitter useEffect removed

    if (!profile) return null;

    const filteredIdeas = sandboxIdeas.filter(i => ideaTab === 'all' || i.status.toLowerCase() === ideaTab);
    const filteredActivities = activities.filter(a => activityFilter === 'all' || a.status.toLowerCase() === activityFilter);
    
    // Filter activities by active platform
    const filteredInstaActivities = filteredActivities.filter(act => act.platforms?.snapdude !== false);
    const filteredLinkedinActivities = filteredActivities.filter(act => act.platforms?.linkedin !== false);
    const filteredYoutubeActivities = filteredActivities.filter(act => act.platforms?.youtube !== false);
    const filteredCarouselActivities = filteredActivities.filter(act => act.platforms?.carousel !== false);

    const activityStatuses = ['all', ...new Set(activities.map(a => a.status.toLowerCase()))];

    const scrollLearning = (dir) => {
        if (learningScrollRef.current) {
            learningScrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
        }
    };

    const scrollProjects = (dir) => {
        if (projectsScrollRef.current) {
            projectsScrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
        }
    };

    const scrollActivities = (dir) => {
        if (activitiesScrollRef.current) {
            activitiesScrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
        }
    };

    // Toggle likes locally
    const handleLike = (id, defaultLikes = 12) => {
        setLikedStates(prev => {
            const current = prev[id] || { liked: false, count: defaultLikes };
            const nextLiked = !current.liked;
            return {
                ...prev,
                [id]: {
                    liked: nextLiked,
                    count: nextLiked ? current.count + 1 : current.count - 1
                }
            };
        });
    };

    const addLocalComment = (id, username, text) => {
        if (!text.trim()) return;
        setSocialComments(prev => ({
            ...prev,
            [id]: [...(prev[id] || []), { username, text, date: 'Just now' }]
        }));
    };

    const handleSuggest = async (e) => {
        e.preventDefault();
        if (!form.name || !form.idea) return;
        setSending(true);
        await addMessage({ name: form.name, email: form.company || 'visitor', message: `[SANDBOX] ${form.name} (${form.company || 'N/A'}): ${form.idea}` });
        setSending(false);
        setSent(true);
        setForm({ name: '', company: '', idea: '' });
        setTimeout(() => setSent(false), 4000);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#F8F9FA] pt-40 sm:pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-[#3AA8F5]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-[#FFB800]/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10 space-y-16 sm:space-y-20">

                    {/* ── Back Link — compact on mobile, full on desktop ── */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/" className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white border-2 border-[#18112E] text-[#18112E] font-black uppercase text-[10px] sm:text-sm shadow-[3px_3px_0_#18112E] sm:shadow-[4px_4px_0_#18112E] hover:shadow-[2px_2px_0_#18112E] hover:translate-y-px transition-all">
                            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" /> Back
                        </Link>
                    </motion.div>

                    {/* ═══════════ HERO ═══════════ */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white border-4 border-[#18112E] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-12 shadow-[8px_8px_0_#18112E] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/20 blur-2xl rounded-full" />
                        <div className="relative z-10 space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18112E] text-[#FFB800] text-[10px] sm:text-xs font-black uppercase tracking-wider mb-4 sm:mb-6">
                                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Life Dashboard
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#18112E] tracking-tight uppercase leading-[0.9]">
                                    Sandbox & <br />
                                    <span className="text-[#3AA8F5] drop-shadow-[2px_2px_0_rgba(24,17,46,1)]">Now Board.</span>
                                </h1>
                                <p className="mt-4 sm:mt-6 text-neutral-500 text-base sm:text-lg md:text-xl font-bold max-w-xl leading-relaxed">
                                    Projects, learning progress, hackathons, journeys — everything I'm building and exploring, live.
                                </p>
                            </div>

                            {/* Social Connections Row */}
                            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-neutral-100">
                                <span className="text-[10px] sm:text-xs font-black uppercase text-[#18112E]/40 tracking-wider">Connect:</span>
                                {profile.github && (
                                    <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#18112E] bg-white text-[#18112E] shadow-[2px_2px_0_#18112E] hover:bg-[#18112E] hover:text-white hover:translate-y-px hover:shadow-[1px_1px_0_#18112E] transition-all">
                                        <Github className="w-3.5 h-3.5" /> GitHub
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#18112E] bg-white text-[#18112E] shadow-[2px_2px_0_#18112E] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:translate-y-px hover:shadow-[1px_1px_0_#18112E] transition-all">
                                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                                    </a>
                                )}
                                {profile.snapdude && (
                                    <a href={profile.snapdude} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#18112E] bg-white text-[#18112E] shadow-[2px_2px_0_#18112E] hover:bg-[#FFFC00] hover:text-[#18112E] hover:border-[#FFFC00] hover:translate-y-px hover:shadow-[1px_1px_0_#18112E] transition-all">
                                        <Camera className="w-3.5 h-3.5" /> Snap Dude
                                    </a>
                                )}
                                {profile.youtube && (
                                    <a href={profile.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#18112E] bg-white text-[#18112E] shadow-[2px_2px_0_#18112E] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:translate-y-px hover:shadow-[1px_1px_0_#18112E] transition-all">
                                        <Youtube className="w-3.5 h-3.5" /> YouTube
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* ═══════════ CURRENT PROJECTS ═══════════ */}
                    <section className="space-y-8">
                        <div className="flex items-end justify-between">
                            <SectionHeader icon={Hammer} label="Building Now" title="Current Projects" color="#FFB800" />
                            <div className="hidden md:flex gap-2 mb-1">
                                <button onClick={() => scrollProjects(-1)}
                                    className="w-10 h-10 rounded-xl bg-white border-2 border-[#18112E] flex items-center justify-center text-[#18112E] shadow-[3px_3px_0_#18112E] hover:shadow-[1px_1px_0_#18112E] hover:translate-y-px transition-all active:scale-95">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={() => scrollProjects(1)}
                                    className="w-10 h-10 rounded-xl bg-white border-2 border-[#18112E] flex items-center justify-center text-[#18112E] shadow-[3px_3px_0_#18112E] hover:shadow-[1px_1px_0_#18112E] hover:translate-y-px transition-all active:scale-95">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div ref={projectsScrollRef} className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scroll-smooth snap-x snap-mandatory scrollbar-thin">
                            {currentProjects.map((proj) => {
                                return (
                                    <motion.div key={proj.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                        onClick={() => setSelectedProject(proj)}
                                        className="bg-white border-2 border-[#18112E] rounded-[24px] sm:rounded-[32px] shadow-[6px_6px_0_#18112E] overflow-hidden w-[290px] sm:w-[360px] shrink-0 snap-start flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-[8px_8px_0_#18112E] transition-all duration-300">
                                        
                                        {/* Card Top: Preview Image */}
                                        <div className="h-44 sm:h-52 w-full bg-[#18112E]/5 border-b border-[#18112E]/10 overflow-hidden relative">
                                            {proj.previewImage ? (
                                                <img src={proj.previewImage} alt={proj.title} className="w-full h-full object-cover animate-fadeIn" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#18112E]/30"><Image className="w-10 h-10" /></div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <StatusBadge status={proj.status} />
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                <h3 className="text-lg sm:text-xl font-black text-[#18112E] tracking-tight line-clamp-1">{proj.title}</h3>
                                                <p className="text-neutral-500 font-bold text-xs sm:text-sm leading-relaxed line-clamp-2">{proj.description}</p>
                                            </div>
                                            
                                            <div className="space-y-1.5 pt-2">
                                                <div className="flex items-center justify-between text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                                                    <span>Progress</span>
                                                    <span>{proj.progress}%</span>
                                                </div>
                                                <ProgressBar percent={proj.progress} size="sm" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>

                    {/* ═══════════ LEARNING TRACKER ═══════════ */}
                    <section className="space-y-8">
                        <SectionHeader icon={GraduationCap} label="Upskilling" title="Learning Tracker" color="#3AA8F5" />

                        {/* ── MOBILE: Horizontal swipeable carousel with progress rings ── */}
                        <div className="block sm:hidden">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                                    <Zap className="w-3.5 h-3.5 text-[#FFB800]" />
                                    Swipe to explore • Tap to expand
                                </div>
                                <div className="flex gap-1.5">
                                    <button onClick={() => scrollLearning(-1)}
                                        className="w-7 h-7 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-[#18112E] hover:border-[#18112E] transition-all active:scale-90">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => scrollLearning(1)}
                                        className="w-7 h-7 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-[#18112E] hover:border-[#18112E] transition-all active:scale-90">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div
                                ref={learningScrollRef}
                                className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth snap-x snap-mandatory scrollbar-thin"
                            >
                                {learningPaths.map((lp) => (
                                    <div key={lp.id} className="w-[260px] shrink-0 snap-start">
                                        <MobileLearningCard
                                            lp={lp}
                                            isActive={activeLearning === lp.id}
                                            onClick={() => setActiveLearning(activeLearning === lp.id ? null : lp.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* Progress Summary Bar */}
                            <div className="mt-2 flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl p-3">
                                <div className="flex -space-x-2">
                                    {learningPaths.slice(0, 3).map((lp) => (
                                        <span key={lp.id} className="w-7 h-7 rounded-full bg-[#18112E] text-sm flex items-center justify-center border-2 border-white">{lp.icon}</span>
                                    ))}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Overall Progress</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-[#3AA8F5] to-[#FFB800] rounded-full"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${Math.round(learningPaths.reduce((sum, lp) => sum + (lp.progress || 0), 0) / Math.max(learningPaths.length, 1))}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-neutral-500">{Math.round(learningPaths.reduce((sum, lp) => sum + (lp.progress || 0), 0) / Math.max(learningPaths.length, 1))}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── DESKTOP: Original grid layout ── */}
                        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {learningPaths.map((lp) => (
                                <motion.div key={lp.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    className="bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-6 shadow-[6px_6px_0_#18112E] space-y-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{lp.icon}</span>
                                            <h3 className="text-lg sm:text-xl font-black text-[#18112E] tracking-tight">{lp.title}</h3>
                                        </div>
                                        <StatusBadge status={lp.status} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-black text-neutral-400 uppercase tracking-wider">
                                            <span>{lp.topicsCompleted?.length || 0}/{(lp.topicsCompleted?.length || 0) + (lp.topicsPending?.length || 0)} topics</span>
                                            <span>{lp.progress}%</span>
                                        </div>
                                        <ProgressBar percent={lp.progress} size="sm" />
                                    </div>
                                    {/* Topics */}
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {(lp.topicsCompleted || []).map((t, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-500">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span className="line-through opacity-60">{t}</span>
                                            </div>
                                        ))}
                                        {(lp.topicsPending || []).map((t, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-400">
                                                <Circle className="w-3.5 h-3.5 text-neutral-300 shrink-0" />{t}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Resources */}
                                    {lp.resources?.length > 0 && (
                                        <div className="pt-2 border-t border-neutral-100">
                                            <h4 className="text-[10px] font-black text-neutral-300 uppercase tracking-wider mb-1.5">Resources</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {lp.resources.map((r, i) => (
                                                    <a key={i} href={r.url} target="_blank" rel="noreferrer" className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#F8F9FA] border border-neutral-200 text-[#3AA8F5] hover:bg-[#3AA8F5] hover:text-white transition-colors">{r.name}</a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {lp.notes && <p className="text-xs font-bold text-neutral-400 italic leading-relaxed">📝 {lp.notes}</p>}
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* ═══════════ ACTIVITIES & JOURNEYS ═══════════ */}
                    <section className="space-y-8">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                            <SectionHeader icon={Globe} label="Adventures" title="Activities & Journeys" color="#18112E" />
                            
                            {/* Platform Feed Switcher Tabs (Filtered Dynamically) */}
                            <div className="flex flex-wrap gap-1.5 bg-white p-1 border-2 border-[#18112E] rounded-xl shadow-[3px_3px_0_#18112E]">
                                {activeTabs.map((t) => {
                                    const IconComponent = t.icon;
                                    const isActive = activeSocialTab === t.id;
                                    return (
                                        <button 
                                            key={t.id} 
                                            onClick={() => setSocialTab(t.id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                                isActive ? `${t.activeColor} shadow-sm` : 'text-neutral-500 hover:text-[#18112E]'
                                            }`}
                                        >
                                            <IconComponent className="w-3.5 h-3.5" />
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Filter Pills (Hide for GitHub and Twitter since they show live/profile timeline feeds) */}
                        {activeSocialTab !== 'github' && (
                            <div className="overflow-x-auto -mx-4 px-4 pb-2">
                                <div className="flex gap-2 w-max">
                                    {activityStatuses.map((s) => (
                                        <button key={s} onClick={() => setActivityFilter(s)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border-2 ${activityFilter === s ? 'bg-[#18112E] text-white border-[#18112E]' : 'bg-white text-neutral-500 border-neutral-200 hover:border-[#18112E]'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Views Container */}
                        <div className="space-y-6">
                            {/* 1. Snap Dude View */}
                            {activeSocialTab === 'snapdude' && (
                                <div className="space-y-8 bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-8 shadow-[6px_6px_0_#18112E] animate-fadeIn">
                                    {/* Profile Header */}
                                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 pb-6 border-b border-neutral-100">
                                        <div className="relative shrink-0">
                                            <div className="absolute inset-0 -m-1 rounded-full bg-[#FFFC00] border-2 border-[#18112E]" />
                                            <img 
                                                src={profile.characterImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                                                alt="" 
                                                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white" 
                                                referrerPolicy="no-referrer"
                                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"; }}
                                            />
                                        </div>
                                        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <h3 className="text-lg sm:text-xl font-black text-[#18112E] tracking-tight truncate">@{snapdudeHandle || profile.name.toLowerCase().replace(/\s+/g, '_')}</h3>
                                                <a href={profile.snapdude || '#'} target="_blank" rel="noreferrer"
                                                   className="inline-flex items-center gap-1.5 px-4 py-1 text-xs font-black uppercase tracking-wider bg-[#FFFC00] text-[#18112E] border-2 border-[#18112E] rounded-xl shadow-[2px_2px_0_#18112E] hover:translate-y-px hover:shadow-[1px_1px_0_#18112E] transition-all">
                                                    👻 Add Friend
                                                </a>
                                            </div>
                                            <div className="flex justify-center sm:justify-start gap-6 text-xs text-neutral-400 font-black uppercase tracking-wider">
                                                <span><strong>{filteredInstaActivities.length}</strong> posts</span>
                                                <span><strong>1.4k</strong> subscribers</span>
                                                <span><strong>680</strong> daily views</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-neutral-500 font-bold leading-normal">
                                                🌟 {profile.title}<br />
                                                🚀 {profile.startupVision}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Photo Grid */}
                                    {filteredInstaActivities.length === 0 ? (
                                        <div className="text-center py-10 text-neutral-400 font-bold uppercase tracking-wider text-xs">No updates found on Snap Dude.</div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                                            {filteredInstaActivities.map((act) => {
                                                const likes = likedStates[act.id]?.count || ((act.id.charCodeAt(2) || 45) * 3) % 120 + 22;
                                                const isLiked = likedStates[act.id]?.liked || false;
                                                const commentsCount = (socialComments[act.id]?.length || 0) + (act.notes ? 1 : 0) + 1;

                                                return (
                                                    <div key={act.id} onClick={() => setSelectedActivity(act)}
                                                        className="group relative aspect-square bg-neutral-100 rounded-[16px] sm:rounded-[24px] overflow-hidden cursor-pointer border-2 border-[#18112E] shadow-[3px_3px_0_#18112E] hover:translate-y-px hover:shadow-[1px_1px_0_#18112E] transition-all hover:ring-2 hover:ring-[#FFFC00]">
                                                        {act.photos && act.photos.length > 0 ? (
                                                            <img src={act.photos[0]} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[#18112E]/30 bg-[#18112E]/5">
                                                                <Camera className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                        {/* Snap Hover Overlay */}
                                                        <div className="absolute inset-0 bg-[#18112E]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-black text-xs sm:text-sm">
                                                            <span className="flex items-center gap-1.5">
                                                                <Heart className={`w-5 h-5 fill-current ${isLiked ? 'text-red-500' : 'text-white'}`} />
                                                                {likes}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <MessageCircle className="w-5 h-5 fill-current text-white" />
                                                                {commentsCount}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Real Snap Dude CTA */}
                                    <div className="text-center pt-4 border-t border-neutral-100">
                                        <a href={profile.snapdude || '#'} target="_blank" rel="noreferrer"
                                           className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FFFC00] text-[#18112E] font-black uppercase text-xs tracking-wider rounded-2xl border-2 border-[#18112E] shadow-[3px_3px_0_#18112E] hover:translate-y-px hover:shadow-[1px_1px_0_#18112E] transition-all active:scale-95">
                                            👻 Add Shrikrishna on Snap Dude →
                                        </a>
                                        <p className="text-[10px] text-neutral-400 font-bold mt-2 uppercase tracking-wider">Follow for coding updates, vlogs, and tech journeys</p>
                                    </div>
                                </div>
                            )}

                            {/* 2. LinkedIn View */}
                            {activeSocialTab === 'linkedin' && (
                                <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn text-left">
                                    {/* Real LinkedIn Profile Header Card */}
                                    <div className="bg-white border-2 border-[#18112E] rounded-[24px] shadow-[6px_6px_0_#18112E] overflow-hidden relative">
                                        {/* Cover Banner */}
                                        <div className="h-32 sm:h-40 bg-gradient-to-r from-[#0A66C2]/85 to-[#004182] relative overflow-hidden">
                                            {profile.bannerImage ? (
                                                <img src={profile.bannerImage} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none'; }} />
                                            ) : null}
                                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                                            <div className="absolute top-0 right-0 bg-[#0A66C2] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl border-l border-b border-[#18112E] z-10">
                                                Official Profile
                                            </div>
                                        </div>

                                        {/* Avatar and Info Container */}
                                        <div className="px-5 sm:px-8 pb-6 relative">
                                            {/* Overlapping Avatar */}
                                            <div className="relative -mt-16 sm:-mt-20 mb-4 inline-block">
                                                <img 
                                                    src={profile.characterImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                                                    alt={profile.name} 
                                                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-white" 
                                                    referrerPolicy="no-referrer"
                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"; }}
                                                />
                                                <span className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-sm flex items-center justify-center" title="Verified Profile">
                                                    <CheckCircle2 className="w-4 h-4 fill-current text-white" />
                                                </span>
                                            </div>

                                            {/* Bio Info */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xl sm:text-2xl font-black text-[#18112E] tracking-tight">{profile.name}</h3>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-[#0A66C2] border border-blue-200">
                                                        IN
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-neutral-500 font-bold leading-relaxed">{profile.title}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex-wrap">
                                                    <span>📍 Pune, Maharashtra, India</span>
                                                    <span>•</span>
                                                    <span className="text-[#0A66C2]">500+ connections</span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                                                    <a href={profile.linkedin} target="_blank" rel="noreferrer"
                                                       className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0A66C2] text-white font-black uppercase text-xs tracking-wider rounded-xl shadow-[3px_3px_0_#18112E] hover:translate-y-px hover:shadow-[1px_1px_0_#18112E] hover:bg-[#004182] transition-all active:scale-98">
                                                        <Linkedin className="w-4 h-4 fill-current text-white" /> Connect on LinkedIn
                                                    </a>
                                                    <a href={`mailto:${profile.email}`}
                                                       className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-[#18112E] border-2 border-[#18112E] font-black uppercase text-xs tracking-wider rounded-xl shadow-[3px_3px_0_#18112E] hover:translate-y-px hover:shadow-[1px_1px_0_#18112E] hover:bg-neutral-50 transition-all active:scale-98">
                                                        <Send className="w-4 h-4" /> Send Message
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* LinkedIn About Card */}
                                    <div className="bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-6 shadow-[6px_6px_0_#18112E] space-y-3">
                                        <h4 className="text-sm font-black text-[#18112E] uppercase tracking-wider">About</h4>
                                        <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed whitespace-pre-wrap">{profile.aboutStory}</p>
                                    </div>

                                    {/* LinkedIn Experience Card */}
                                    <div className="bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-6 shadow-[6px_6px_0_#18112E] space-y-4">
                                        <h4 className="text-sm font-black text-[#18112E] uppercase tracking-wider flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-[#0A66C2]" /> Experience
                                        </h4>
                                        {experience.length === 0 ? (
                                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">No experience loaded.</p>
                                        ) : (
                                            <div className="space-y-6">
                                                {experience.map((exp, idx) => (
                                                    <div key={exp.id} className="relative flex gap-4">
                                                        {idx !== experience.length - 1 && (
                                                            <span className="absolute left-6 top-12 bottom-0 w-0.5 bg-neutral-100" />
                                                        )}
                                                        <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                                                            <Briefcase className="w-6 h-6 text-neutral-400" />
                                                        </div>
                                                        <div className="space-y-1.5 flex-1 min-w-0">
                                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                                                                <div>
                                                                    <h5 className="text-sm font-black text-[#18112E] tracking-tight">{exp.role}</h5>
                                                                    <p className="text-xs text-neutral-500 font-bold">{exp.company}</p>
                                                                </div>
                                                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{exp.duration}</span>
                                                            </div>
                                                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">📍 {exp.location}</p>
                                                            <p className="text-xs text-neutral-600 font-medium leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                                            {exp.skills && exp.skills.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 pt-1.5">
                                                                    {exp.skills.map((s, i) => (
                                                                        <span key={i} className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-neutral-50 border border-neutral-200 text-neutral-500">{s}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* LinkedIn Education Card */}
                                    <div className="bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-6 shadow-[6px_6px_0_#18112E] space-y-4">
                                        <h4 className="text-sm font-black text-[#18112E] uppercase tracking-wider flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-[#0A66C2]" /> Education
                                        </h4>
                                        {education.length === 0 ? (
                                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">No education loaded.</p>
                                        ) : (
                                            <div className="space-y-6">
                                                {education.map((edu) => (
                                                    <div key={edu.id} className="flex gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                                                            <GraduationCap className="w-6 h-6 text-neutral-400" />
                                                        </div>
                                                        <div className="space-y-1.5 flex-1 min-w-0">
                                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                                                                <div>
                                                                    <h5 className="text-sm font-black text-[#18112E] tracking-tight">{edu.school}</h5>
                                                                    <p className="text-xs text-neutral-500 font-bold">{edu.degree}</p>
                                                                </div>
                                                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{edu.duration}</span>
                                                            </div>
                                                            <p className="text-xs text-[#0A66C2] font-black uppercase tracking-wider">{edu.grade}</p>
                                                            {edu.activities && (
                                                                <p className="text-xs text-neutral-600 font-medium leading-relaxed"><span className="font-bold text-neutral-400">Activities:</span> {edu.activities}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* LinkedIn Certifications Card */}
                                    <div className="bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-6 shadow-[6px_6px_0_#18112E] space-y-4">
                                        <h4 className="text-sm font-black text-[#18112E] uppercase tracking-wider flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-[#0A66C2]" /> Licenses & Certifications
                                        </h4>
                                        {achievements.length === 0 ? (
                                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">No certifications loaded.</p>
                                        ) : (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {achievements.map((ach) => (
                                                    <div key={ach.id} className="p-4 bg-[#F8F9FA] border border-neutral-200 rounded-xl space-y-2">
                                                        <div className="flex items-start gap-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                                                <Trophy className="w-4 h-4 text-[#0A66C2]" />
                                                            </div>
                                                            <div>
                                                                <h5 className="text-xs sm:text-sm font-black text-[#18112E] tracking-tight line-clamp-2">{ach.title}</h5>
                                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Issued {ach.date}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Recent Activity Feed Header */}
                                    <div className="border-b border-neutral-200 pb-2 pt-4 flex items-center justify-between">
                                        <h4 className="text-sm font-black text-[#18112E] uppercase tracking-wider flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-[#0A66C2]" /> Recent Activity & Posts
                                        </h4>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">⚡ Live Feed</span>
                                    </div>

                                    {/* Posts Feed */}
                                    {filteredLinkedinActivities.length === 0 ? (
                                        <div className="bg-white border-2 border-[#18112E] rounded-[24px] p-10 text-center text-neutral-400 font-bold uppercase tracking-wider text-xs">No updates found.</div>
                                    ) : (
                                        filteredLinkedinActivities.map((act) => {
                                            const likes = likedStates[act.id]?.count || ((act.id.charCodeAt(2) || 45) * 5) % 150 + 34;
                                            const isLiked = likedStates[act.id]?.liked || false;
                                            const comments = socialComments[act.id] || [];

                                            return (
                                                <div key={act.id} className="bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-6 shadow-[6px_6px_0_#18112E] space-y-4 text-left">
                                                    {/* Post Header */}
                                                    <div className="flex items-start justify-between gap-2 min-w-0">
                                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                                            <img 
                                                                src={profile.characterImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                                                                alt="" 
                                                                className="w-10 h-10 rounded-full object-cover border border-[#18112E] shrink-0" 
                                                                referrerPolicy="no-referrer"
                                                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"; }}
                                                            />
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="text-xs sm:text-sm font-black text-[#18112E] tracking-tight truncate">{profile.name}</h4>
                                                                <p className="text-[10px] text-neutral-400 font-bold truncate">{profile.title}</p>
                                                                <p className="text-[9px] text-neutral-400 font-medium truncate">{act.date} • {act.location || 'Online'} • 🌐</p>
                                                            </div>
                                                        </div>
                                                        <div className="shrink-0">
                                                            <StatusBadge status={act.status} />
                                                        </div>
                                                    </div>

                                                    {/* Text description */}
                                                    <div className="space-y-2">
                                                        <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed whitespace-pre-wrap">{act.description}</p>
                                                        {act.tags && (
                                                            <div className="flex flex-wrap gap-1.5 text-[10px] sm:text-xs font-black text-[#0A66C2]">
                                                                {act.tags.map((tag, i) => (
                                                                    <span key={i}>#{tag.toLowerCase().replace(/\s+/g, '')}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Image Media */}
                                                    {act.photos && act.photos.length > 0 && (
                                                        <div onClick={() => setSelectedActivity(act)}
                                                            className="rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50 max-h-80 cursor-pointer">
                                                            <img 
                                                                src={act.photos[0]} 
                                                                alt="" 
                                                                className="w-full h-full object-cover" 
                                                                referrerPolicy="no-referrer"
                                                                onError={(e) => {
                                                                    const parent = e.target.closest('.rounded-xl');
                                                                    if (parent) parent.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Notes Alert */}
                                                    {act.notes && (
                                                        <div className="p-3 bg-[#F8F9FA] border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 italic">
                                                            📌 Key Learnings: {act.notes}
                                                        </div>
                                                    )}

                                                    {/* Likes counts */}
                                                    <div className="flex items-center justify-between text-[9px] text-neutral-400 font-black uppercase tracking-wider pt-2 border-t border-neutral-100">
                                                        <span>👍 {likes} likes</span>
                                                        <span>{comments.length + 2} comments</span>
                                                    </div>

                                                    {/* Engagement Action buttons */}
                                                    <div className="flex items-center justify-between border-t border-b border-neutral-100 py-1 text-xs font-bold text-neutral-500">
                                                        <button onClick={() => handleLike(act.id, likes)}
                                                            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-neutral-50 active:scale-95 transition-all ${isLiked ? 'text-[#0A66C2]' : ''}`}>
                                                            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                                            <span>Like</span>
                                                        </button>
                                                        <button onClick={() => document.getElementById(`comm-input-${act.id}`)?.focus()}
                                                            className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-neutral-50 transition-all">
                                                            <MessageCircle className="w-4 h-4" />
                                                            <span>Comment</span>
                                                        </button>
                                                        <button className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-neutral-50 transition-all">
                                                            <Share2 className="w-4 h-4" />
                                                            <span>Share</span>
                                                        </button>
                                                    </div>

                                                    {/* Comments display & submission */}
                                                    <div className="space-y-3">
                                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                                                            <div className="flex gap-2 text-xs">
                                                                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 font-black text-[9px] text-neutral-500">JD</div>
                                                                <div className="bg-neutral-50 rounded-xl p-2 flex-1">
                                                                    <div className="flex items-center justify-between"><strong className="text-neutral-700">John Doe</strong><span className="text-[9px] text-neutral-400">1d</span></div>
                                                                    <p className="text-neutral-500 font-medium mt-0.5">Awesome! Great experience 🚀</p>
                                                                </div>
                                                            </div>
                                                            {comments.map((comment, i) => (
                                                                <div key={i} className="flex gap-2 text-xs animate-fadeIn">
                                                                    <div className="w-6 h-6 rounded-full bg-[#18112E] text-white flex items-center justify-center shrink-0 font-black text-[9px] uppercase">{comment.username.substring(0,2)}</div>
                                                                    <div className="bg-neutral-50 rounded-xl p-2 flex-1">
                                                                        <div className="flex items-center justify-between"><strong className="text-neutral-700">{comment.username}</strong><span className="text-[9px] text-neutral-400">{comment.date}</span></div>
                                                                        <p className="text-neutral-500 font-medium mt-0.5">{comment.text}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <form onSubmit={(e) => {
                                                            e.preventDefault();
                                                            const fd = new FormData(e.target);
                                                            const txt = fd.get('text');
                                                            if (txt) {
                                                                addLocalComment(act.id, 'Visitor', txt);
                                                                e.target.reset();
                                                            }
                                                        }} className="flex gap-2">
                                                            <input id={`comm-input-${act.id}`} name="text" type="text" placeholder="Add a comment..." required
                                                                className="flex-1 bg-[#F8F9FA] border-2 border-[#18112E] rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:bg-white transition-all" />
                                                            <button type="submit" className="px-3 py-1.5 bg-[#18112E] text-white font-black uppercase text-[10px] rounded-xl shadow-[2px_2px_0_#18112E] active:scale-95 transition-all">Post</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {/* 3. GitHub View — REAL & LIVE from github.com/shrikrishna-lab */}
                            {activeSocialTab === 'github' && (
                                <div className="space-y-6 animate-fadeIn text-left">
                                    {/* Real GitHub profile card with live API data */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-6 bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-6 shadow-[6px_6px_0_#18112E]">
                                        {ghProfile?.avatar_url ? (
                                            <img src={ghProfile.avatar_url} alt={ghUsername} className="w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] object-cover border-2 border-[#18112E] shadow-[2px_2px_0_#18112E] shrink-0" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-[16px] bg-[#18112E] flex items-center justify-center border-2 border-[#18112E] shadow-[2px_2px_0_#18112E] shrink-0 animate-pulse">
                                                <Github className="w-10 h-10 text-white" />
                                            </div>
                                        )}
                                        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <h3 className="text-base sm:text-lg font-black text-[#18112E] tracking-tight">{ghProfile?.name || ghUsername}</h3>
                                                <span className="text-xs text-neutral-400 font-bold">@{ghUsername}</span>
                                            </div>
                                            {ghProfile?.bio && <p className="text-xs sm:text-sm text-neutral-500 font-bold">{ghProfile.bio}</p>}
                                            <div className="flex justify-center sm:justify-start items-center gap-3 text-[10px] text-neutral-400 font-black uppercase tracking-wider flex-wrap">
                                                {ghProfile ? (
                                                    <>
                                                        <span>📦 {ghProfile.public_repos} repos</span>
                                                        <span>•</span>
                                                        <span>👥 {ghProfile.followers} followers</span>
                                                        <span>•</span>
                                                        <span>{ghProfile.following} following</span>
                                                        {ghProfile.location && <><span>•</span><span>📍 {ghProfile.location}</span></>}
                                                    </>
                                                ) : (
                                                    <span className="animate-pulse">Loading profile…</span>
                                                )}
                                                <span>•</span>
                                                <a href={profile.github} target="_blank" rel="noreferrer" className="text-[#3AA8F5] hover:underline flex items-center gap-1 font-bold">View Full Profile <ExternalLink className="w-3 h-3" /></a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real Public Repositories */}
                                    {ghRepos.length > 0 && (
                                        <div className="bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-8 shadow-[6px_6px_0_#18112E] space-y-4">
                                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                                <h4 className="text-xs font-black text-[#18112E] uppercase tracking-wider flex items-center gap-1.5"><Code2 className="w-4 h-4 text-[#3AA8F5]" /> Public Repositories</h4>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200">Live from GitHub API</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {ghRepos.map((repo) => (
                                                    <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
                                                       className="block p-4 bg-[#F8F9FA] border-2 border-neutral-100 rounded-xl hover:border-[#18112E] hover:shadow-[2px_2px_0_#18112E] transition-all group">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h5 className="text-xs sm:text-sm font-black text-[#18112E] group-hover:text-[#3AA8F5] transition-colors truncate">{repo.name}</h5>
                                                            <ExternalLink className="w-3 h-3 text-neutral-300 group-hover:text-[#3AA8F5] shrink-0 mt-0.5 transition-colors" />
                                                        </div>
                                                        {repo.description && <p className="text-[11px] text-neutral-400 font-bold mt-1 line-clamp-2">{repo.description}</p>}
                                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-400 font-black uppercase tracking-wider">
                                                            {repo.language && (
                                                                <span className="flex items-center gap-1">
                                                                    <span className={`w-2 h-2 rounded-full ${
                                                                        repo.language === 'JavaScript' ? 'bg-[#F7DF1E]' :
                                                                        repo.language === 'TypeScript' ? 'bg-[#3178C6]' :
                                                                        repo.language === 'Python' ? 'bg-[#3572A5]' :
                                                                        repo.language === 'Java' ? 'bg-[#B07219]' :
                                                                        repo.language === 'HTML' ? 'bg-[#E34C26]' :
                                                                        repo.language === 'CSS' ? 'bg-[#563D7C]' :
                                                                        repo.language === 'Lua' ? 'bg-[#000080]' :
                                                                        'bg-neutral-400'
                                                                    }`} />
                                                                    {repo.language}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-0.5"><Star className="w-3 h-3" /> {repo.stargazers_count}</span>
                                                            <span className="flex items-center gap-0.5"><GitFork className="w-3 h-3" /> {repo.forks_count}</span>
                                                            {repo.updated_at && <span className="hidden sm:inline">{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* GitHub Live Event Feed */}
                                    <div className="bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-8 shadow-[6px_6px_0_#18112E] space-y-6">
                                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                            <h4 className="text-xs font-black text-[#18112E] uppercase tracking-wider flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#FFB800]" /> Recent Activity Feed</h4>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">⚡ Real-time</span>
                                        </div>

                                        {ghLoading && (
                                            <div className="text-center py-12 space-y-3">
                                                <div className="w-8 h-8 border-4 border-[#18112E] border-t-transparent rounded-full animate-spin mx-auto" />
                                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Fetching live updates from GitHub...</p>
                                            </div>
                                        )}

                                        {ghError && (
                                            <div className="text-center py-12 text-red-500 font-bold text-xs uppercase tracking-wider">
                                                ⚠️ Failed to load real-time GitHub activity.<br />
                                                <span className="text-[10px] text-neutral-400 mt-1 block">{ghError} — Check network or try refreshing.</span>
                                            </div>
                                        )}

                                        {!ghLoading && !ghError && ghEvents.length === 0 && (
                                            <div className="text-center py-12 text-neutral-400 font-bold uppercase tracking-wider text-xs">No recent public GitHub activity found.</div>
                                        )}

                                        {!ghLoading && !ghError && ghEvents.length > 0 && (
                                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                                                {ghEvents.map((evt) => {
                                                    const repoName = evt.repo?.name || '';
                                                    const shortRepo = repoName.split('/').pop() || repoName;
                                                    const date = new Date(evt.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                                                    
                                                    let actionText = '';
                                                    let detailText = '';
                                                    if (evt.type === 'PushEvent') {
                                                        const commits = evt.payload?.commits || [];
                                                        actionText = `Pushed ${commits.length} commit${commits.length > 1 ? 's' : ''} to`;
                                                        detailText = commits.map(c => `• ${c.message}`).join('\n') || 'Updated repository code';
                                                    } else if (evt.type === 'CreateEvent') {
                                                        actionText = `Created ${evt.payload?.ref_type || 'repository'} in`;
                                                        detailText = evt.payload?.description || `Initialized new branch/repository ref`;
                                                    } else if (evt.type === 'PullRequestEvent') {
                                                        actionText = `${evt.payload?.action === 'opened' ? 'Opened' : 'Closed'} Pull Request in`;
                                                        detailText = evt.payload?.pull_request?.title || 'PR details';
                                                    } else if (evt.type === 'IssuesEvent') {
                                                        actionText = `${evt.payload?.action === 'opened' ? 'Opened' : 'Closed'} Issue in`;
                                                        detailText = evt.payload?.issue?.title || 'Issue details';
                                                    } else if (evt.type === 'WatchEvent') {
                                                        actionText = `Starred`;
                                                        detailText = `Starred ${repoName}`;
                                                    } else if (evt.type === 'ForkEvent') {
                                                        actionText = `Forked`;
                                                        detailText = `Created fork of ${repoName}`;
                                                    } else if (evt.type === 'DeleteEvent') {
                                                        actionText = `Deleted ${evt.payload?.ref_type || 'ref'} in`;
                                                        detailText = `Removed ${evt.payload?.ref || 'branch'}`;
                                                    } else {
                                                        actionText = `${evt.type?.replace('Event', '')} in`;
                                                        detailText = `Updated project`;
                                                    }

                                                    return (
                                                        <div key={evt.id} className="p-4 bg-[#F8F9FA] border-2 border-neutral-100 rounded-xl flex items-start gap-3.5 hover:border-[#18112E] transition-colors">
                                                            <div className="w-8 h-8 rounded-lg bg-[#18112E]/5 border border-[#18112E]/10 flex items-center justify-center text-[#18112E] shrink-0 mt-0.5">
                                                                <ListChecks className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0 flex-1 space-y-1">
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                                    <div className="text-xs font-bold text-neutral-500">
                                                                        {actionText} <a href={`https://github.com/${repoName}`} target="_blank" rel="noreferrer" className="text-[#18112E] hover:underline font-black">{shortRepo}</a>
                                                                    </div>
                                                                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider shrink-0">{date}</span>
                                                                </div>
                                                                <p className="text-[11px] sm:text-xs text-neutral-400 font-bold leading-normal whitespace-pre-line bg-white/50 p-2 rounded-lg border border-neutral-100">{detailText}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Twitter view removed */}

                            {/* 5. YouTube View */}
                            {activeSocialTab === 'youtube' && (
                                <div className="space-y-6 animate-fadeIn">
                                    {/* YouTube channel banner */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-6 bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-6 shadow-[6px_6px_0_#18112E]">
                                        <img src={profile.characterImage} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#FF0000]" />
                                        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-black text-[#18112E] tracking-tight">{profile.name} DevLogs</h3>
                                            <div className="flex justify-center sm:justify-start items-center gap-3 text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider flex-wrap">
                                                <span>@shrikrishna_vlogs</span>
                                                <span>•</span>
                                                <span><strong>1.8K</strong> subscribers</span>
                                                <span>•</span>
                                                <span><strong>{filteredYoutubeActivities.length}</strong> videos</span>
                                            </div>
                                            <button className="px-5 py-1.5 text-xs font-black uppercase tracking-wider bg-[#FF0000] text-white rounded-full shadow-[2px_2px_0_#18112E] hover:opacity-90 active:scale-95 transition-all">Subscribe</button>
                                        </div>
                                    </div>

                                    {filteredYoutubeActivities.length === 0 ? (
                                        <div className="bg-white border-2 border-[#18112E] rounded-[24px] p-10 text-center text-neutral-400 font-bold uppercase tracking-wider text-xs">No videos found.</div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            {filteredYoutubeActivities.map((act) => {
                                                const duration = ((act.id.charCodeAt(2) || 45) % 15 + 4) + ":" + ((act.id.charCodeAt(3) || 72) % 50 + 10);
                                                const views = ((act.id.charCodeAt(2) || 45) * 12) % 900 + 130;

                                                return (
                                                    <div key={act.id} onClick={() => setSelectedActivity(act)}
                                                        className="group cursor-pointer space-y-3 bg-white border-2 border-[#18112E] rounded-[24px] p-4 shadow-[4px_4px_0_#18112E] hover:-translate-y-1 hover:shadow-[6px_6px_0_#18112E] transition-all duration-300">
                                                        {/* Video Thumbnail */}
                                                        <div className="aspect-video w-full bg-neutral-900 rounded-xl overflow-hidden relative border border-[#18112E]/10">
                                                            {act.photos && act.photos.length > 0 ? (
                                                                <img src={act.photos[0]} alt="" className="w-full h-full object-cover opacity-85 group-hover:scale-102 group-hover:opacity-100 transition-all duration-500" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-800"><Play className="w-12 h-12" /></div>
                                                            )}
                                                            {/* Play button Overlay */}
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                <div className="w-12 h-8 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                                                    <Play className="w-4 h-4 text-white fill-current" />
                                                                </div>
                                                            </div>
                                                            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-black text-white">{duration}</span>
                                                        </div>

                                                        {/* Video Details */}
                                                        <div className="flex gap-2.5 align-top text-left">
                                                            <img src={profile.characterImage} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 border border-neutral-200" />
                                                            <div className="min-w-0">
                                                                <h4 className="text-xs sm:text-sm font-black text-[#18112E] tracking-tight leading-tight line-clamp-2">{act.title} | {act.type} Vlog</h4>
                                                                <p className="text-[10px] text-neutral-400 font-bold mt-1 uppercase tracking-wider">Shrikrishna Dev</p>
                                                                <p className="text-[9px] text-neutral-400 font-medium mt-0.5">{views} views • {act.date}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 6. Carousel Feed View */}
                            {activeSocialTab === 'carousel' && (
                                <div className="relative animate-fadeIn">
                                    {/* Desktop left/right chevrons next to scroll cards */}
                                    <div className="absolute -top-16 right-0 hidden md:flex gap-2">
                                        <button onClick={() => scrollActivities(-1)}
                                            className="w-10 h-10 rounded-xl bg-white border-2 border-[#18112E] flex items-center justify-center text-[#18112E] shadow-[3px_3px_0_#18112E] hover:shadow-[1px_1px_0_#18112E] hover:translate-y-px transition-all active:scale-95">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => scrollActivities(1)}
                                            className="w-10 h-10 rounded-xl bg-white border-2 border-[#18112E] flex items-center justify-center text-[#18112E] shadow-[3px_3px_0_#18112E] hover:shadow-[1px_1px_0_#18112E] hover:translate-y-px transition-all active:scale-95">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div ref={activitiesScrollRef} className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scroll-smooth snap-x snap-mandatory scrollbar-thin">
                                        <AnimatePresence mode="popLayout">
                                            {filteredCarouselActivities.map((act) => {
                                                return (
                                                    <motion.div key={act.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                                        onClick={() => setSelectedActivity(act)}
                                                        className={`bg-white border-2 border-[#18112E] rounded-[24px] sm:rounded-[32px] shadow-[6px_6px_0_#18112E] overflow-hidden w-[290px] sm:w-[360px] shrink-0 snap-start flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-[8px_8px_0_#18112E] transition-all duration-300 ${act.status.toLowerCase() === 'failed' ? 'opacity-75' : ''}`}>
                                                        
                                                        {/* Card Top: Photo Preview */}
                                                        <div className="h-44 sm:h-52 w-full bg-[#18112E]/5 border-b border-[#18112E]/10 overflow-hidden relative">
                                                            {act.photos && act.photos.length > 0 ? (
                                                                <img src={act.photos[0]} alt={act.title} className="w-full h-full object-cover animate-fadeIn" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[#18112E]/30"><Camera className="w-10 h-10" /></div>
                                                            )}
                                                            <div className="absolute top-3 right-3">
                                                                <StatusBadge status={act.status} />
                                                            </div>
                                                        </div>

                                                        {/* Card Body */}
                                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                                                            <div className="space-y-2">
                                                                <h3 className={`text-lg sm:text-xl font-black text-[#18112E] tracking-tight line-clamp-1 ${act.status.toLowerCase() === 'failed' ? 'line-through text-neutral-400' : ''}`}>{act.title}</h3>
                                                                <p className="text-neutral-500 font-bold text-xs sm:text-sm leading-relaxed line-clamp-2">{act.description}</p>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                                                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{act.date}</span>
                                                                {act.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{act.location}</span>}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                        {filteredCarouselActivities.length === 0 && (
                                            <div className="bg-white border-2 border-dashed border-[#18112E] rounded-[24px] p-10 text-center text-neutral-400 font-bold uppercase tracking-wider text-sm w-full">
                                                No activities in this filter.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ═══════════ IDEA REPOSITORY ═══════════ */}
                    <section className="space-y-8">
                        <SectionHeader icon={Lightbulb} label="Brainstorm" title="Idea Repository" color="#3AA8F5" />
                        <div className="overflow-x-auto -mx-4 px-4 pb-2">
                            <div className="flex gap-2 w-max bg-white p-1 border-2 border-[#18112E] rounded-xl">
                                {['all', 'active', 'brainstorming', 'buried'].map((tab) => (
                                    <button key={tab} onClick={() => setIdeaTab(tab)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${ideaTab === tab ? 'bg-[#18112E] text-white' : 'text-neutral-500 hover:text-[#18112E]'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-5">
                            <AnimatePresence mode="popLayout">
                                {filteredIdeas.map((idea, idx) => (
                                    <motion.div key={idea.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className={`bg-white border-2 border-[#18112E] rounded-[24px] p-5 sm:p-7 shadow-[6px_6px_0_#18112E] relative ${idea.status.toLowerCase() === 'buried' ? 'opacity-60 border-dashed' : ''}`}>
                                        <div className="space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                                <h3 className={`text-xl font-black text-[#18112E] ${idea.status.toLowerCase() === 'buried' ? 'line-through text-neutral-400' : ''}`}>{idea.title}</h3>
                                                <StatusBadge status={idea.status} />
                                            </div>
                                            <p className="text-neutral-500 font-bold text-sm leading-relaxed">{idea.description}</p>
                                            {idea.notes && (
                                                <div className="p-3 rounded-xl bg-[#F8F9FA] border border-neutral-200 text-sm font-bold text-neutral-500 flex items-start gap-2">
                                                    <span className="shrink-0">📝</span>
                                                    <p><span className="block text-[10px] font-black uppercase text-neutral-300 tracking-wider mb-0.5">Note:</span>{idea.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {filteredIdeas.length === 0 && (
                                <div className="bg-white border-2 border-dashed border-[#18112E] rounded-[24px] p-10 text-center text-neutral-400 font-bold uppercase tracking-wider text-sm">No ideas here.</div>
                            )}
                        </div>
                    </section>

                    {/* ═══════════ ENHANCED ACTIVITY LOG / DEVLOG ═══════════ */}
                    <section className="space-y-8">
                        <SectionHeader icon={BookOpen} label="Devlog" title="Activity Log" />
                        <div className="bg-white border-2 border-[#18112E] shadow-[6px_6px_0_#18112E] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 max-h-[600px] overflow-y-auto">
                            {nowLogs.length === 0 ? (
                                <div className="text-center py-10 text-neutral-400 font-bold uppercase tracking-wider text-sm">No logs yet.</div>
                            ) : (
                                <div className="relative border-l-2 border-neutral-200 pl-6 sm:pl-8 space-y-8">
                                    {nowLogs.map((log) => (
                                        <DevlogEntry key={log.id} log={log} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ═══════════ SUGGEST FORM ═══════════ */}
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="bg-white border-4 border-[#18112E] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-12 shadow-[8px_8px_0_#18112E] relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#3AA8F5]/10 blur-3xl rounded-full" />
                        <div className="max-w-2xl relative z-10 space-y-5">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-1 bg-[#18112E] rounded-full" />
                                <h3 className="text-lg sm:text-xl font-black text-[#18112E] uppercase tracking-wider">Suggest a Feature</h3>
                            </div>
                            <p className="text-neutral-500 font-bold text-sm sm:text-base leading-relaxed">
                                Recruiter, developer, or founder? Suggest an idea or feature — it goes straight to my inbox!
                            </p>
                            <form onSubmit={handleSuggest} className="space-y-3">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                        className="flex-1 bg-[#F8F9FA] border-2 border-[#18112E] rounded-xl px-4 py-3 text-[#18112E] placeholder-neutral-400 focus:outline-none focus:bg-white transition-all font-bold text-sm" />
                                    <input type="text" placeholder="Company (Optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                                        className="flex-1 bg-[#F8F9FA] border-2 border-[#18112E] rounded-xl px-4 py-3 text-[#18112E] placeholder-neutral-400 focus:outline-none focus:bg-white transition-all font-bold text-sm" />
                                </div>
                                <textarea placeholder="I think you should build..." value={form.idea} onChange={(e) => setForm({ ...form, idea: e.target.value })} required
                                    className="w-full min-h-[80px] bg-[#F8F9FA] border-2 border-[#18112E] rounded-xl px-4 py-3 text-[#18112E] placeholder-neutral-400 focus:outline-none focus:bg-white transition-all font-bold text-sm resize-none" />
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <button type="submit" disabled={sending}
                                        className="flex items-center gap-2 px-5 py-3 bg-[#18112E] text-white font-black uppercase text-xs sm:text-sm rounded-xl hover:bg-black transition-colors disabled:opacity-50 shadow-[4px_4px_0_#18112E] active:scale-95">
                                        {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Cast Idea</>}
                                    </button>
                                    <AnimatePresence>
                                        {sent && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-600 font-black text-xs uppercase">✨ Submitted!</motion.span>}
                                    </AnimatePresence>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Project Detail Modal ── */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#18112E]/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white border-4 border-[#18112E] rounded-[24px] sm:rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative text-left">
                            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-[#18112E] bg-neutral-100 p-1.5 rounded-full border border-neutral-200">
                                <XCircle className="w-5 h-5" />
                            </button>

                            {selectedProject.previewImage && (
                                <img src={selectedProject.previewImage} alt="" className="w-full h-48 sm:h-64 object-cover rounded-2xl border-2 border-[#18112E]" />
                            )}

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-2xl sm:text-3xl font-black text-[#18112E] tracking-tight">{selectedProject.title}</h3>
                                    <StatusBadge status={selectedProject.status} />
                                </div>
                                <p className="text-neutral-500 font-bold text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{selectedProject.description}</p>
                            </div>

                            {/* Tech Stack */}
                            {selectedProject.techStack && (
                                <div>
                                    <h4 className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-2">Tech Stack</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.techStack.split(',').map((t, i) => (
                                            <span key={i} className="px-3 py-1 text-xs font-bold rounded-lg bg-white border-2 border-[#18112E] text-[#18112E] shadow-[2px_2px_0_#18112E]">{t.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tasks Grid */}
                            <div className="grid sm:grid-cols-2 gap-6 pt-2">
                                <div>
                                    <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Done ({selectedProject.tasksDone?.length || 0})</h4>
                                    <ul className="space-y-2">
                                        {(selectedProject.tasksDone || []).map((t, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm font-bold text-neutral-500"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{t}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[#FFB800] uppercase tracking-wider mb-3 flex items-center gap-1.5"><Circle className="w-4 h-4" /> Pending ({selectedProject.tasksPending?.length || 0})</h4>
                                    <ul className="space-y-2">
                                        {(selectedProject.tasksPending || []).map((t, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm font-bold text-neutral-400"><Circle className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Changelog */}
                            {selectedProject.changelog?.length > 0 && (
                                <div className="pt-4 border-t border-neutral-100">
                                    <h4 className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-3">Changelog</h4>
                                    <div className="space-y-3">
                                        {selectedProject.changelog.map((c, i) => (
                                            <div key={i} className="flex items-start gap-3 text-sm">
                                                <span className="shrink-0 text-xs font-black text-neutral-300 w-16 pt-0.5">{c.date}</span>
                                                <span className="font-bold text-neutral-600 leading-normal">{c.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Links */}
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-100">
                                {selectedProject.githubUrl && <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2.5 bg-[#18112E] text-white rounded-xl text-xs font-black border-2 border-[#18112E] shadow-[3px_3px_0_#18112E] hover:bg-black transition-colors"><Github className="w-4 h-4" /> Code</a>}
                                {selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FFB800] text-[#18112E] rounded-xl text-xs font-black border-2 border-[#18112E] shadow-[3px_3px_0_#18112E] transition-colors"><ExternalLink className="w-4 h-4" /> Live</a>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Activity Detail Modal ── */}
            <AnimatePresence>
                {selectedActivity && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedActivity(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#18112E]/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white border-4 border-[#18112E] rounded-[24px] sm:rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative text-left">
                            <button onClick={() => setSelectedActivity(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-[#18112E] bg-neutral-100 p-1.5 rounded-full border border-neutral-200">
                                <XCircle className="w-5 h-5" />
                            </button>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-2xl sm:text-3xl font-black text-[#18112E] tracking-tight">{selectedActivity.title}</h3>
                                    <StatusBadge status={selectedActivity.status} />
                                </div>
                                <div className="flex flex-wrap items-center gap-3.5 text-xs font-black text-neutral-400 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{selectedActivity.date}</span>
                                    {selectedActivity.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{selectedActivity.location}</span>}
                                    <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" />{selectedActivity.type}</span>
                                </div>
                                <p className="text-neutral-500 font-bold text-sm sm:text-base leading-relaxed pt-2 whitespace-pre-wrap">{selectedActivity.description}</p>
                            </div>

                            {/* Photos Carousel */}
                            {selectedActivity.photos?.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><Camera className="w-4 h-4" /> Journey Gallery</h4>
                                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
                                        {selectedActivity.photos.map((p, i) => (
                                            <img key={i} src={p} alt="" className="w-64 sm:w-80 h-44 sm:h-52 rounded-2xl object-cover border-2 border-[#18112E] shrink-0 animate-fadeIn" />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {selectedActivity.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedActivity.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 text-xs font-bold rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-600">{tag}</span>
                                    ))}
                                </div>
                            )}

                            {/* Notes */}
                            {selectedActivity.notes && (
                                <div className="p-4 rounded-2xl bg-[#F8F9FA] border-2 border-[#18112E] text-sm font-bold text-neutral-600 flex items-start gap-2.5">
                                    <span className="shrink-0 text-lg">📝</span>
                                    <p><span className="block text-[10px] font-black uppercase text-neutral-300 tracking-wider mb-0.5">Learnings & Notes:</span>{selectedActivity.notes}</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
}
