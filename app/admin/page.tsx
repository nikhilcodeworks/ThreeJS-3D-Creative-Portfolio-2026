'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PersonalInfo {
  name: string;
  fullName: string;
  role: string;
  roleExtended: string;
  eyebrow: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  availability: string;
  bio: string;
  bioExtended: string[];
}

interface Skills {
  frontend: string[];
  backend: string[];
  tools: string[];
}

interface ProjectSection {
  title: string;
  content: string;
}

interface ProjectStat {
  label: string;
  sub: string;
}

interface Work {
  slug: string;
  num: string;
  title: string;
  fullTitle: string;
  category: string;
  tags: string[];
  year: string;
  description: string;
  role: string;
  tech: string[];
  challenge: string;
  outcome: string;
  liveUrl: string;
  githubUrl: string;
  accent: string;
  bgGradient: string;
  image: string;
  themeClass: string;
  badge: string;
  stats: ProjectStat[];
  sections: ProjectSection[];
}

interface Experience {
  period: string;
  role: string;
  company: string;
  location: string;
  desc: string;
  tags: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  cgpa: string;
  desc: string;
}

interface Principle {
  num: string;
  word: string;
  desc: string;
}

interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: Skills;
  works: Work[];
  experiences: Experience[];
  education: Education;
  principles: Principle[];
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const S = {
  // Layout
  container: { display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' } as React.CSSProperties,
  sidebar: { width: '220px', minWidth: '220px', background: '#1a1a2e', color: '#fff', display: 'flex', flexDirection: 'column' as const, padding: '0' },
  sidebarHeader: { padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  sidebarTitle: { fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' },
  sidebarSub: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' },
  sidebarNav: { flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column' as const, gap: '2px' },
  navItem: (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    padding: '0.6rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.825rem',
    background: active ? '#2563eb' : 'transparent',
    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
    border: 'none', width: '100%', textAlign: 'left', transition: 'all 0.15s',
    fontWeight: active ? 600 : 400,
  }),
  sidebarFooter: { padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' },
  logoutBtn: { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', width: '100%' },
  main: { flex: 1, padding: '2rem', overflowY: 'auto' as const, background: '#f8fafc' },
  // Cards
  card: { background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.25rem' } as React.CSSProperties,
  cardTitle: { fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' } as React.CSSProperties,
  // Page header
  pageHeader: { marginBottom: '1.5rem' } as React.CSSProperties,
  pageTitle: { fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: 0 } as React.CSSProperties,
  pageSub: { fontSize: '0.825rem', color: '#64748b', marginTop: '0.25rem' } as React.CSSProperties,
  // Form
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' } as React.CSSProperties,
  formRowFull: { marginBottom: '1rem' } as React.CSSProperties,
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  input: { width: '100%', padding: '0.55rem 0.75rem', fontSize: '0.875rem', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', color: '#1e293b', background: '#fff', boxSizing: 'border-box' as const, transition: 'border-color 0.15s' },
  textarea: { width: '100%', padding: '0.55rem 0.75rem', fontSize: '0.875rem', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', color: '#1e293b', background: '#fff', boxSizing: 'border-box' as const, resize: 'vertical' as const, minHeight: '80px', fontFamily: 'inherit', transition: 'border-color 0.15s' },
  // Buttons
  btn: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: '7px', padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' } as React.CSSProperties,
  btnSm: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
  btnDanger: { background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '5px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
  btnGhost: { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '5px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
  btnSuccess: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: '7px', padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
  // Item cards for lists
  itemCard: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' } as React.CSSProperties,
  itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' } as React.CSSProperties,
  itemNum: { fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px' } as React.CSSProperties,
  // Status badge
  badge: (color: string): React.CSSProperties => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, background: color === 'green' ? '#dcfce7' : color === 'red' ? '#fee2e2' : '#fef9c3', color: color === 'green' ? '#16a34a' : color === 'red' ? '#dc2626' : '#854d0e' }),
  // Login
  loginWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' } as React.CSSProperties,
  loginCard: { background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2.5rem', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' } as React.CSSProperties,
  loginTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' } as React.CSSProperties,
  loginSub: { fontSize: '0.825rem', color: '#64748b', marginBottom: '1.75rem' } as React.CSSProperties,
  // Toast
  toast: (type: 'success' | 'error'): React.CSSProperties => ({ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, background: type === 'success' ? '#16a34a' : '#dc2626', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function arrToStr(arr: string[]): string {
  return arr.join(', ');
}
function strToArr(s: string): string[] {
  return s.split(',').map(x => x.trim()).filter(Boolean);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return <div style={S.toast(type)}>{type === 'success' ? '✓' : '✕'} {msg}</div>;
}

function SaveBar({ onSave, saving, label }: { onSave: () => void; saving: boolean; label?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
      <button style={S.btn} onClick={onSave} disabled={saving}>
        {saving ? '⏳ Saving…' : `💾 ${label || 'Save Changes'}`}
      </button>
    </div>
  );
}

// ─── Tab: Personal Info ───────────────────────────────────────────────────────

function PersonalInfoTab({
  data, password, onSaved, onToast,
}: {
  data: PortfolioData;
  password: string;
  onSaved: (d: PortfolioData) => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}) {
  const pi = data.personalInfo;
  const [form, setForm] = useState({ ...pi, bioExtendedStr: pi.bioExtended.join('\n\n') });
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save() {
    setSaving(true);
    const updated: PortfolioData = {
      ...data,
      personalInfo: {
        ...form,
        bioExtended: form.bioExtendedStr.split('\n\n').map(s => s.trim()).filter(Boolean),
      },
    };
    const res = await fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    if (res.ok) { onSaved(updated); onToast('Personal info saved!', 'success'); }
    else onToast('Save failed', 'error');
  }

  return (
    <div>
      <div style={S.pageHeader}>
        <h1 style={S.pageTitle}>Personal Info</h1>
        <p style={S.pageSub}>Edit your basic profile information</p>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Identity</div>
        <div style={S.formRow}>
          <div>
            <label style={S.label}>Name</label>
            <input style={S.input} value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Full Name</label>
            <input style={S.input} value={form.fullName} onChange={e => set('fullName', e.target.value)} />
          </div>
        </div>
        <div style={S.formRow}>
          <div>
            <label style={S.label}>Role</label>
            <input style={S.input} value={form.role} onChange={e => set('role', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Role Extended</label>
            <input style={S.input} value={form.roleExtended} onChange={e => set('roleExtended', e.target.value)} />
          </div>
        </div>
        <div style={S.formRow}>
          <div>
            <label style={S.label}>Eyebrow Text</label>
            <input style={S.input} value={form.eyebrow} onChange={e => set('eyebrow', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Availability</label>
            <input style={S.input} value={form.availability} onChange={e => set('availability', e.target.value)} />
          </div>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Contact</div>
        <div style={S.formRow}>
          <div>
            <label style={S.label}>Location</label>
            <input style={S.input} value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
        </div>
        <div style={S.formRow}>
          <div>
            <label style={S.label}>Phone</label>
            <input style={S.input} value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>GitHub URL</label>
            <input style={S.input} value={form.github} onChange={e => set('github', e.target.value)} />
          </div>
        </div>
        <div style={S.formRowFull}>
          <label style={S.label}>LinkedIn URL</label>
          <input style={S.input} value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Bio</div>
        <div style={S.formRowFull}>
          <label style={S.label}>Short Bio (hero/subtitle)</label>
          <textarea style={{ ...S.textarea, minHeight: '60px' }} value={form.bio} onChange={e => set('bio', e.target.value)} />
        </div>
        <div style={S.formRowFull}>
          <label style={S.label}>Extended Bio (About section — separate paragraphs with blank line)</label>
          <textarea style={{ ...S.textarea, minHeight: '140px' }} value={form.bioExtendedStr} onChange={e => set('bioExtendedStr', e.target.value)} />
        </div>
        <SaveBar onSave={save} saving={saving} />
      </div>
    </div>
  );
}

// ─── Tab: Skills ─────────────────────────────────────────────────────────────

function SkillsTab({
  data, password, onSaved, onToast,
}: {
  data: PortfolioData;
  password: string;
  onSaved: (d: PortfolioData) => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}) {
  const [form, setForm] = useState({
    frontend: arrToStr(data.skills.frontend),
    backend: arrToStr(data.skills.backend),
    tools: arrToStr(data.skills.tools),
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const updated: PortfolioData = {
      ...data,
      skills: {
        frontend: strToArr(form.frontend),
        backend: strToArr(form.backend),
        tools: strToArr(form.tools),
      },
    };
    const res = await fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    if (res.ok) { onSaved(updated); onToast('Skills saved!', 'success'); }
    else onToast('Save failed', 'error');
  }

  return (
    <div>
      <div style={S.pageHeader}>
        <h1 style={S.pageTitle}>Skills</h1>
        <p style={S.pageSub}>Comma-separated values for each category</p>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Frontend</div>
        <textarea style={{ ...S.textarea, minHeight: '70px' }} value={form.frontend} onChange={e => setForm(f => ({ ...f, frontend: e.target.value }))} placeholder="React.js, Next.js, TypeScript, ..." />
        <div style={{ marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Preview: {strToArr(form.frontend).map((s, i) => <span key={i} style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', margin: '0.15rem' }}>{s}</span>)}
          </span>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Backend</div>
        <textarea style={{ ...S.textarea, minHeight: '70px' }} value={form.backend} onChange={e => setForm(f => ({ ...f, backend: e.target.value }))} placeholder="Node.js, Express.js, MongoDB, ..." />
        <div style={{ marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Preview: {strToArr(form.backend).map((s, i) => <span key={i} style={{ display: 'inline-block', background: '#f0fdf4', color: '#16a34a', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', margin: '0.15rem' }}>{s}</span>)}
          </span>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Tools & Platforms</div>
        <textarea style={{ ...S.textarea, minHeight: '70px' }} value={form.tools} onChange={e => setForm(f => ({ ...f, tools: e.target.value }))} placeholder="Git / GitHub, Postman, Figma, ..." />
        <div style={{ marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Preview: {strToArr(form.tools).map((s, i) => <span key={i} style={{ display: 'inline-block', background: '#fdf4ff', color: '#9333ea', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', margin: '0.15rem' }}>{s}</span>)}
          </span>
        </div>
        <SaveBar onSave={save} saving={saving} />
      </div>
    </div>
  );
}

// ─── Tab: Projects ────────────────────────────────────────────────────────────

function ProjectsTab({
  data, password, onSaved, onToast,
}: {
  data: PortfolioData;
  password: string;
  onSaved: (d: PortfolioData) => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}) {
  const [works, setWorks] = useState<Work[]>(data.works);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);

  function updateWork(i: number, key: keyof Work, value: string) {
    setWorks(ws => ws.map((w, idx) => idx === i ? { ...w, [key]: value } : w));
  }
  function updateWorkArr(i: number, key: keyof Work, value: string) {
    setWorks(ws => ws.map((w, idx) => idx === i ? { ...w, [key]: strToArr(value) } : w));
  }
  function addWork() {
    const num = String(works.length + 1).padStart(2, '0');
    setWorks(ws => [...ws, { slug: `project-${num}`, num, title: 'NEW PROJECT', fullTitle: 'New Project', category: '', tags: [], year: String(new Date().getFullYear()), description: '', role: '', tech: [], challenge: '', outcome: '', liveUrl: '#', githubUrl: '#', accent: '#2563eb', bgGradient: 'from-[#0f0f0f] to-[#1a1a2e]', image: '', themeClass: 'is_blue', badge: '', stats: [], sections: [] }]);
  }
  function removeWork(i: number) {
    setWorks(ws => ws.filter((_, idx) => idx !== i));
  }

  async function handleImageUpload(i: number, file: File) {
    setUploading(i);
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(',')[1];
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ fileBase64: b64, fileName: file.name, mimeType: file.type }),
      });
      if (res.ok) {
        const { path } = await res.json();
        setWorks(ws => ws.map((w, idx) => idx === i ? { ...w, image: path } : w));
        onToast('Image uploaded!', 'success');
      } else {
        onToast('Image upload failed', 'error');
      }
      setUploading(null);
    };
    reader.readAsDataURL(file);
  }

  async function save() {
    setSaving(true);
    const updated: PortfolioData = { ...data, works };
    const res = await fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    if (res.ok) { onSaved(updated); onToast('Projects saved!', 'success'); }
    else onToast('Save failed', 'error');
  }

  return (
    <div>
      <div style={{ ...S.pageHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={S.pageTitle}>Projects</h1>
          <p style={S.pageSub}>{works.length} projects · drag to reorder (edit to change order)</p>
        </div>
        <button style={S.btnSm} onClick={addWork}>+ Add Project</button>
      </div>
      {works.map((w, i) => (
        <div key={i} style={S.card}>
          <div style={S.itemHeader}>
            <span style={S.itemNum}>#{w.num} — {w.title}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <label style={{ ...S.btnGhost, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {uploading === i ? '⏳' : '📷 Image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleImageUpload(i, e.target.files[0]); }} />
              </label>
              <button style={S.btnDanger} onClick={() => removeWork(i)}>Remove</button>
            </div>
          </div>
          {w.image && <div style={{ marginBottom: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>Image: <code>{w.image}</code></div>}
          <div style={S.formRow}>
            <div>
              <label style={S.label}>Num</label>
              <input style={S.input} value={w.num} onChange={e => updateWork(i, 'num', e.target.value)} />
            </div>
            <div>
              <label style={S.label}>Year</label>
              <input style={S.input} value={w.year} onChange={e => updateWork(i, 'year', e.target.value)} />
            </div>
          </div>
          <div style={S.formRow}>
            <div>
              <label style={S.label}>Title (uppercase)</label>
              <input style={S.input} value={w.title} onChange={e => updateWork(i, 'title', e.target.value)} />
            </div>
            <div>
              <label style={S.label}>Full Title</label>
              <input style={S.input} value={w.fullTitle} onChange={e => updateWork(i, 'fullTitle', e.target.value)} />
            </div>
          </div>
          <div style={S.formRow}>
            <div>
              <label style={S.label}>Slug</label>
              <input style={S.input} value={w.slug} onChange={e => updateWork(i, 'slug', e.target.value)} />
            </div>
            <div>
              <label style={S.label}>Category / Badge</label>
              <input style={S.input} value={w.category} onChange={e => { updateWork(i, 'category', e.target.value); updateWork(i, 'badge', e.target.value); }} />
            </div>
          </div>
          <div style={S.formRow}>
            <div>
              <label style={S.label}>Tags (comma-separated)</label>
              <input style={S.input} value={arrToStr(w.tags)} onChange={e => updateWorkArr(i, 'tags', e.target.value)} />
            </div>
            <div>
              <label style={S.label}>Tech Stack (comma-separated)</label>
              <input style={S.input} value={arrToStr(w.tech)} onChange={e => updateWorkArr(i, 'tech', e.target.value)} />
            </div>
          </div>
          <div style={S.formRowFull}>
            <label style={S.label}>Description</label>
            <textarea style={S.textarea} value={w.description} onChange={e => updateWork(i, 'description', e.target.value)} />
          </div>
          <div style={S.formRow}>
            <div>
              <label style={S.label}>Live URL</label>
              <input style={S.input} value={w.liveUrl} onChange={e => updateWork(i, 'liveUrl', e.target.value)} />
            </div>
            <div>
              <label style={S.label}>GitHub URL</label>
              <input style={S.input} value={w.githubUrl} onChange={e => updateWork(i, 'githubUrl', e.target.value)} />
            </div>
          </div>
          <div style={S.formRow}>
            <div>
              <label style={S.label}>Accent Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="color" value={w.accent} onChange={e => updateWork(i, 'accent', e.target.value)} style={{ width: '36px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                <input style={{ ...S.input, flex: 1 }} value={w.accent} onChange={e => updateWork(i, 'accent', e.target.value)} />
              </div>
            </div>
            <div>
              <label style={S.label}>Role</label>
              <input style={S.input} value={w.role} onChange={e => updateWork(i, 'role', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <SaveBar onSave={save} saving={saving} />
    </div>
  );
}

// ─── Tab: Experience ──────────────────────────────────────────────────────────

function ExperienceTab({
  data, password, onSaved, onToast,
}: {
  data: PortfolioData;
  password: string;
  onSaved: (d: PortfolioData) => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}) {
  const [exps, setExps] = useState<Experience[]>(data.experiences);
  const [saving, setSaving] = useState(false);

  function update(i: number, key: keyof Experience, value: string) {
    setExps(es => es.map((e, idx) => idx === i ? { ...e, [key]: key === 'tags' ? strToArr(value) : value } : e));
  }
  function add() {
    setExps(es => [...es, { period: 'Jan 2025 — Present', role: 'Job Title', company: 'Company Name', location: 'City', desc: '', tags: [] }]);
  }
  function remove(i: number) {
    setExps(es => es.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    const updated = { ...data, experiences: exps };
    const res = await fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    if (res.ok) { onSaved(updated); onToast('Experience saved!', 'success'); }
    else onToast('Save failed', 'error');
  }

  return (
    <div>
      <div style={{ ...S.pageHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={S.pageTitle}>Experience</h1>
          <p style={S.pageSub}>{exps.length} positions</p>
        </div>
        <button style={S.btnSm} onClick={add}>+ Add Position</button>
      </div>
      {exps.map((exp, i) => (
        <div key={i} style={S.card}>
          <div style={S.itemHeader}>
            <span style={S.itemNum}>{exp.role} @ {exp.company}</span>
            <button style={S.btnDanger} onClick={() => remove(i)}>Remove</button>
          </div>
          <div style={S.formRow}>
            <div>
              <label style={S.label}>Period</label>
              <input style={S.input} value={exp.period} onChange={e => update(i, 'period', e.target.value)} placeholder="Jan 2024 — Apr 2024" />
            </div>
            <div>
              <label style={S.label}>Location</label>
              <input style={S.input} value={exp.location} onChange={e => update(i, 'location', e.target.value)} />
            </div>
          </div>
          <div style={S.formRow}>
            <div>
              <label style={S.label}>Role / Title</label>
              <input style={S.input} value={exp.role} onChange={e => update(i, 'role', e.target.value)} />
            </div>
            <div>
              <label style={S.label}>Company</label>
              <input style={S.input} value={exp.company} onChange={e => update(i, 'company', e.target.value)} />
            </div>
          </div>
          <div style={S.formRowFull}>
            <label style={S.label}>Description</label>
            <textarea style={S.textarea} value={exp.desc} onChange={e => update(i, 'desc', e.target.value)} />
          </div>
          <div style={S.formRowFull}>
            <label style={S.label}>Tags (comma-separated)</label>
            <input style={S.input} value={arrToStr(exp.tags)} onChange={e => update(i, 'tags', e.target.value)} />
          </div>
        </div>
      ))}
      <SaveBar onSave={save} saving={saving} />
    </div>
  );
}

// ─── Tab: Education ───────────────────────────────────────────────────────────

function EducationTab({
  data, password, onSaved, onToast,
}: {
  data: PortfolioData;
  password: string;
  onSaved: (d: PortfolioData) => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}) {
  const [form, setForm] = useState({ ...data.education });
  const [saving, setSaving] = useState(false);

  function set(k: keyof Education, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save() {
    setSaving(true);
    const updated = { ...data, education: form };
    const res = await fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    if (res.ok) { onSaved(updated); onToast('Education saved!', 'success'); }
    else onToast('Save failed', 'error');
  }

  return (
    <div>
      <div style={S.pageHeader}>
        <h1 style={S.pageTitle}>Education</h1>
        <p style={S.pageSub}>Your academic background</p>
      </div>
      <div style={S.card}>
        <div style={S.formRow}>
          <div>
            <label style={S.label}>Degree</label>
            <input style={S.input} value={form.degree} onChange={e => set('degree', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Institution</label>
            <input style={S.input} value={form.institution} onChange={e => set('institution', e.target.value)} />
          </div>
        </div>
        <div style={S.formRow}>
          <div>
            <label style={S.label}>Location</label>
            <input style={S.input} value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Period</label>
            <input style={S.input} value={form.period} onChange={e => set('period', e.target.value)} placeholder="2020 — 2024" />
          </div>
        </div>
        <div style={S.formRowFull}>
          <label style={S.label}>CGPA / Grade</label>
          <input style={S.input} value={form.cgpa} onChange={e => set('cgpa', e.target.value)} placeholder="7.6 / 10" />
        </div>
        <div style={S.formRowFull}>
          <label style={S.label}>Description</label>
          <textarea style={S.textarea} value={form.desc} onChange={e => set('desc', e.target.value)} />
        </div>
        <SaveBar onSave={save} saving={saving} />
      </div>
    </div>
  );
}

// ─── Tab: Principles ─────────────────────────────────────────────────────────

function PrinciplesTab({
  data, password, onSaved, onToast,
}: {
  data: PortfolioData;
  password: string;
  onSaved: (d: PortfolioData) => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}) {
  const [principles, setPrinciples] = useState<Principle[]>(data.principles);
  const [saving, setSaving] = useState(false);

  function update(i: number, key: keyof Principle, value: string) {
    setPrinciples(ps => ps.map((p, idx) => idx === i ? { ...p, [key]: value } : p));
  }
  function add() {
    const num = String(principles.length + 1).padStart(2, '0');
    setPrinciples(ps => [...ps, { num, word: 'Principle', desc: 'Description here.' }]);
  }
  function remove(i: number) {
    setPrinciples(ps => ps.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    const updated = { ...data, principles };
    const res = await fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    if (res.ok) { onSaved(updated); onToast('Principles saved!', 'success'); }
    else onToast('Save failed', 'error');
  }

  return (
    <div>
      <div style={{ ...S.pageHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={S.pageTitle}>Principles</h1>
          <p style={S.pageSub}>{principles.length} principles</p>
        </div>
        <button style={S.btnSm} onClick={add}>+ Add Principle</button>
      </div>
      {principles.map((p, i) => (
        <div key={i} style={S.card}>
          <div style={S.itemHeader}>
            <span style={S.itemNum}>{p.num} — {p.word}</span>
            <button style={S.btnDanger} onClick={() => remove(i)}>Remove</button>
          </div>
          <div style={S.formRow}>
            <div>
              <label style={S.label}>Number</label>
              <input style={S.input} value={p.num} onChange={e => update(i, 'num', e.target.value)} />
            </div>
            <div>
              <label style={S.label}>Word / Title</label>
              <input style={S.input} value={p.word} onChange={e => update(i, 'word', e.target.value)} />
            </div>
          </div>
          <div style={S.formRowFull}>
            <label style={S.label}>Description</label>
            <textarea style={S.textarea} value={p.desc} onChange={e => update(i, 'desc', e.target.value)} />
          </div>
        </div>
      ))}
      <SaveBar onSave={save} saving={saving} />
    </div>
  );
}

// ─── Tab: Resume Upload ───────────────────────────────────────────────────────

interface ParsedResume {
  name?: string;
  title?: string;
  bio?: string;
  bioExtended?: string[];
  location?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  skills?: { frontend?: string[]; backend?: string[]; tools?: string[] };
  experiences?: Experience[];
  education?: Education;
  projects?: Array<{ num?: string; title?: string; tags?: string[]; desc?: string; link?: string; year?: string }>;
}

function ResumeUploadTab({
  data, password, onSaved, onToast,
}: {
  data: PortfolioData;
  password: string;
  onSaved: (d: PortfolioData) => void;
  onToast: (m: string, t: 'success' | 'error') => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  async function parseResume() {
    if (!file) return;
    setParsing(true);
    setParsed(null);
    setRawText(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(',')[1];
      try {
        const res = await fetch('/api/parse-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
          body: JSON.stringify({ fileBase64: b64, mimeType: file.type, fileName: file.name }),
        });
        const json = await res.json();
        if (json.success) {
          setParsed(json.data);
          onToast('Resume parsed successfully!', 'success');
        } else {
          setRawText(json.raw || 'Failed to parse');
          onToast('Parsing returned raw text', 'error');
        }
      } catch {
        onToast('Parse request failed', 'error');
      }
      setParsing(false);
    };
    reader.readAsDataURL(file);
  }

  async function applyAll() {
    if (!parsed) return;
    setApplying(true);
    const updated: PortfolioData = {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        name: parsed.name || data.personalInfo.name,
        fullName: parsed.name || data.personalInfo.fullName,
        role: parsed.title || data.personalInfo.role,
        bio: parsed.bio || data.personalInfo.bio,
        bioExtended: parsed.bioExtended || data.personalInfo.bioExtended,
        location: parsed.location || data.personalInfo.location,
        email: parsed.email || data.personalInfo.email,
        phone: parsed.phone || data.personalInfo.phone,
        github: parsed.github || data.personalInfo.github,
        linkedin: parsed.linkedin || data.personalInfo.linkedin,
      },
      skills: {
        frontend: parsed.skills?.frontend || data.skills.frontend,
        backend: parsed.skills?.backend || data.skills.backend,
        tools: parsed.skills?.tools || data.skills.tools,
      },
      experiences: parsed.experiences || data.experiences,
      education: parsed.education || data.education,
    };
    const res = await fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    });
    setApplying(false);
    if (res.ok) { onSaved(updated); onToast('All fields updated from resume!', 'success'); }
    else onToast('Apply failed', 'error');
  }

  return (
    <div>
      <div style={S.pageHeader}>
        <h1 style={S.pageTitle}>Resume Upload</h1>
        <p style={S.pageSub}>Parse your resume with Gemini AI to auto-fill portfolio data</p>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Upload Resume / Document</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' as const }}>
          <label style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', cursor: 'pointer', flex: 1 }}>
            <span style={S.label}>Select File (PDF, DOC, DOCX, TXT, JPG, PNG)</span>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' as const, background: '#f8fafc' }}>
              {file ? (
                <div>
                  <div style={{ fontSize: '1.5rem' }}>📄</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginTop: '0.25rem' }}>{file.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2rem' }}>☁️</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Click to select file</div>
                </div>
              )}
              <input type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
            </div>
          </label>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
          <button style={S.btn} onClick={parseResume} disabled={!file || parsing}>
            {parsing ? '⏳ Parsing with Gemini…' : '✨ Parse with Gemini AI'}
          </button>
          {file && <button style={S.btnGhost} onClick={() => { setFile(null); setParsed(null); setRawText(null); }}>Clear</button>}
        </div>
      </div>

      {rawText && (
        <div style={S.card}>
          <div style={S.cardTitle}>Raw Response (parse failed)</div>
          <pre style={{ fontSize: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '6px', overflow: 'auto', maxHeight: '300px', whiteSpace: 'pre-wrap' as const }}>{rawText}</pre>
        </div>
      )}

      {parsed && (
        <div style={S.card}>
          <div style={{ ...S.cardTitle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Extracted Data Preview</span>
            <button style={S.btnSuccess} onClick={applyAll} disabled={applying}>
              {applying ? '⏳ Applying…' : '✅ Apply to All Fields'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {parsed.name && (
              <div>
                <label style={S.label}>Name</label>
                <div style={{ fontSize: '0.875rem', color: '#1e293b', padding: '0.4rem 0' }}>{parsed.name}</div>
              </div>
            )}
            {parsed.title && (
              <div>
                <label style={S.label}>Title</label>
                <div style={{ fontSize: '0.875rem', color: '#1e293b', padding: '0.4rem 0' }}>{parsed.title}</div>
              </div>
            )}
            {parsed.email && (
              <div>
                <label style={S.label}>Email</label>
                <div style={{ fontSize: '0.875rem', color: '#1e293b', padding: '0.4rem 0' }}>{parsed.email}</div>
              </div>
            )}
            {parsed.location && (
              <div>
                <label style={S.label}>Location</label>
                <div style={{ fontSize: '0.875rem', color: '#1e293b', padding: '0.4rem 0' }}>{parsed.location}</div>
              </div>
            )}
            {parsed.github && (
              <div>
                <label style={S.label}>GitHub</label>
                <div style={{ fontSize: '0.875rem', color: '#2563eb', padding: '0.4rem 0' }}>{parsed.github}</div>
              </div>
            )}
            {parsed.phone && (
              <div>
                <label style={S.label}>Phone</label>
                <div style={{ fontSize: '0.875rem', color: '#1e293b', padding: '0.4rem 0' }}>{parsed.phone}</div>
              </div>
            )}
          </div>
          {parsed.bio && (
            <div style={{ marginTop: '0.75rem' }}>
              <label style={S.label}>Bio</label>
              <div style={{ fontSize: '0.875rem', color: '#1e293b', padding: '0.4rem 0' }}>{parsed.bio}</div>
            </div>
          )}
          {parsed.skills && (
            <div style={{ marginTop: '0.75rem' }}>
              <label style={S.label}>Skills</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const }}>
                {[...(parsed.skills.frontend || []), ...(parsed.skills.backend || []), ...(parsed.skills.tools || [])].map((s, i) => (
                  <span key={i} style={{ background: '#eff6ff', color: '#2563eb', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {parsed.experiences && parsed.experiences.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <label style={S.label}>Experience ({parsed.experiences.length} positions)</label>
              {parsed.experiences.map((exp, i) => (
                <div key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{exp.role}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{exp.company} · {exp.period}</div>
                </div>
              ))}
            </div>
          )}
          {parsed.education && (
            <div style={{ marginTop: '0.75rem' }}>
              <label style={S.label}>Education</label>
              <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>{parsed.education.degree} — {parsed.education.institution}</div>
            </div>
          )}
          {parsed.projects && parsed.projects.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <label style={S.label}>Projects ({parsed.projects.length} found — not auto-applied, review manually)</label>
              {parsed.projects.map((proj, i) => (
                <div key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{proj.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{proj.year} · {arrToStr(proj.tags || [])}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fffbeb', borderRadius: '6px', fontSize: '0.8rem', color: '#92400e', border: '1px solid #fde68a' }}>
            ⚠️ Review the extracted data above before applying. Projects are shown for reference only and must be added manually in the Projects tab.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = 'personal' | 'skills' | 'projects' | 'experience' | 'education' | 'principles' | 'resume';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'personal', label: 'Personal Info', icon: '👤' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'projects', label: 'Projects', icon: '🗂️' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'principles', label: 'Principles', icon: '✦' },
  { id: 'resume', label: 'Resume Upload', icon: '📄' },
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [inputPwd, setInputPwd] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TabId>('personal');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem('admin_session');
    if (saved) { setPassword(saved); setLoggedIn(true); }
  }, []);

  // Load data when logged in
  const loadData = useCallback(async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio-data', { headers: { 'x-admin-password': pwd } });
      if (res.ok) { setData(await res.json()); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (loggedIn && password) loadData(password); }, [loggedIn, password, loadData]);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function login() {
    if (!inputPwd.trim()) return;
    setPassword(inputPwd.trim());
    localStorage.setItem('admin_session', inputPwd.trim());
    setLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem('admin_session');
    setLoggedIn(false);
    setPassword('');
    setInputPwd('');
    setData(null);
  }

  // ── Login Screen ──
  if (!loggedIn) {
    return (
      <div style={S.loginWrap}>
        <div style={S.loginCard}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔐</div>
          <h1 style={S.loginTitle}>Admin Panel</h1>
          <p style={S.loginSub}>Enter your admin password to continue</p>
          <label style={S.label}>Password</label>
          <input
            style={{ ...S.input, marginBottom: '1rem' }}
            type="password"
            value={inputPwd}
            onChange={e => setInputPwd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Enter admin password"
            autoFocus
          />
          <button style={{ ...S.btn, width: '100%', justifyContent: 'center' }} onClick={login}>
            Sign In →
          </button>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem', textAlign: 'center' }}>
            Set ADMIN_PASSWORD in .env.local
          </p>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (loading || !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading portfolio data…</div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div style={S.container}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.sidebarHeader}>
          <div style={S.sidebarTitle}>Portfolio Admin</div>
          <div style={S.sidebarSub}>{data.personalInfo.name} · {data.personalInfo.role}</div>
        </div>
        <nav style={S.sidebarNav}>
          {TABS.map(t => (
            <button key={t.id} style={S.navItem(tab === t.id)} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div style={S.sidebarFooter}>
          <button style={{ ...S.logoutBtn, marginBottom: '0.5rem' }} onClick={() => loadData(password)}>
            🔄 Reload Data
          </button>
          <button style={S.logoutBtn} onClick={logout}>
            ← Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={S.main}>
        {tab === 'personal' && <PersonalInfoTab data={data} password={password} onSaved={setData} onToast={showToast} />}
        {tab === 'skills' && <SkillsTab data={data} password={password} onSaved={setData} onToast={showToast} />}
        {tab === 'projects' && <ProjectsTab data={data} password={password} onSaved={setData} onToast={showToast} />}
        {tab === 'experience' && <ExperienceTab data={data} password={password} onSaved={setData} onToast={showToast} />}
        {tab === 'education' && <EducationTab data={data} password={password} onSaved={setData} onToast={showToast} />}
        {tab === 'principles' && <PrinciplesTab data={data} password={password} onSaved={setData} onToast={showToast} />}
        {tab === 'resume' && <ResumeUploadTab data={data} password={password} onSaved={setData} onToast={showToast} />}
      </main>
    </div>
  );
}
