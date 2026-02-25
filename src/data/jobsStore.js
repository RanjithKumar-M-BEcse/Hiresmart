import { mockJobs } from './mockData';

const JOBS_KEY = 'hs_jobs';

export function loadJobs() {
  try {
    const saved = localStorage.getItem(JOBS_KEY);
    return saved ? JSON.parse(saved) : mockJobs;
  } catch {
    return mockJobs;
  }
}

export function saveJobs(jobs) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function addJob(newJob) {
  const existing = loadJobs();
  const updated = [newJob, ...existing];
  saveJobs(updated);
  return updated;
}

export function deleteJobById(jobId) {
  const updated = loadJobs().filter((job) => job.id !== jobId);
  saveJobs(updated);
  return updated;
}

export function updateJobById(jobId, updater) {
  const updated = loadJobs().map((job) => {
    if (job.id !== jobId) return job;
    return typeof updater === 'function' ? updater(job) : { ...job, ...updater };
  });
  saveJobs(updated);
  return updated;
}
