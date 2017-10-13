import conf from './configuration'

export const URL_LABELS = `/projects/${conf.target.project_id}/labels`
export const URL_MILESTONES = `/projects/${conf.target.project_id}/milestones`
export const URL_ISSUES = `/projects/${conf.target.project_id}/issues`
export const URL_USERS = `/projects/${conf.target.project_id}/users`
export const URL_NOTES = issue_iid => `/projects/${conf.target.project_id}/issues/${issue_iid}/notes`
export const URL_UPLOADS = `/projects/${conf.target.project_id}/uploads`
export const URL_WIKIS = `/projects/${conf.target.project_id}/wikis`