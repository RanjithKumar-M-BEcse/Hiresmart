import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterSidebar from '../../components/RecruiterSidebar';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { mockJobs } from '../../data/mockData';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { recruiterProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('hs_jobs');
      return saved ? JSON.parse(saved) : mockJobs;
    } catch { return mockJobs; }
  });

  const handleDelete = (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    const updated = jobs.filter((j) => j.id !== id);
    setJobs(updated);
    localStorage.setItem('hs_jobs', JSON.stringify(updated));
  };

  const openCount   = jobs.filter((j) => j.status === 'OPEN').length;
  const closedCount = jobs.filter((j) => j.status === 'CLOSED').length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <RecruiterSidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar portal="recruiter" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-8">

          {/* Company profile chip */}
          {recruiterProfile && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-card">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-xl shrink-0">🏢</div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{recruiterProfile.companyName}</p>
                <p className="text-xs text-slate-400">{recruiterProfile.designation} · {recruiterProfile.companyLocation}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <span className="badge badge-blue">✓ Profile Complete</span>
              </div>
            </div>
          )}

          {/* Banner */}
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}>
            <div>
              <h2 className="font-display font-bold text-lg">Recruiter Dashboard</h2>
              <p className="text-brand-200 text-sm mt-0.5">Manage your job postings and applicants</p>
            </div>
            <button onClick={() => navigate('/recruiter/create-job')}
              className="shrink-0 bg-white text-brand-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors shadow-md">
              + Post New Job
            </button>
          </div>

          {/* Stat — only total jobs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Jobs', value: jobs.length, icon: '📋', color: 'text-slate-900' },
              { label: 'Open',       value: openCount,   icon: '🟢', color: 'text-emerald-600' },
              { label: 'Closed',     value: closedCount, icon: '🔴', color: 'text-red-500' },
            ].map((s) => (
              <div key={s.label} className="stat-card text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Jobs table */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="section-title">Job Listings</h2>
                <p className="text-sm text-slate-400 mt-0.5">{jobs.length} jobs posted</p>
              </div>
              <button onClick={() => navigate('/recruiter/create-job')} className="btn-primary text-xs">
                + New Job
              </button>
            </div>

            {jobs.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-5xl mb-3">📭</div>
                <p className="font-semibold text-slate-600 mb-4">No jobs posted yet.</p>
                <button onClick={() => navigate('/recruiter/create-job')} className="btn-primary">
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Job Title</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Applicants</th>
                      <th className="px-4 py-3 text-center">Threshold</th>
                      <th className="px-4 py-3 text-center">Top N</th>
                      <th className="px-4 py-3">Posted</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 text-sm">{job.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{job.location} · {job.type}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`badge ${job.status === 'OPEN' ? 'badge-green' : 'badge-red'}`}>
                            {job.status === 'OPEN' ? '🟢 OPEN' : '🔴 CLOSED'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-slate-800 text-sm">
                          {job.applicants?.length ?? 0}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="badge badge-amber">{job.threshold}%</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="badge badge-violet">Top {job.topN}</span>
                        </td>
                        <td className="px-4 py-4 text-slate-500 text-sm">{job.postedDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/recruiter/job/${job.id}`)}
                              className="btn-secondary text-xs py-1.5 px-3">
                              View
                            </button>
                            <button onClick={() => handleDelete(job.id)} className="btn-danger text-xs py-1.5 px-3">
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
