# GitLab Importer (Work in progress)
A utility that migrates backups from [JIRA](https://www.atlassian.com/software/jira), [Assembla](https://www.assembla.com/home) and other sources to [GitLab](https://gitlab.com).

## Problem Statement
GitLab doesn't have any data import utility. GitLab might make one someday, but till that time only thing you've is GitLab API.

## This Solution
This solution leverages GitLab's API to migrate your data to a GitLab project. It's designed to be modular, extensible, and adaptable to different types of backup structures. This project also takes files/attachments into account.

## Assumptions
Following are some of the assumptions the project makes about your backup:
1. Your data is in one JSON file.
2. All of your attachments/files are in one folder.
3. The JSON structure contains arrays of following entities. Paths of those entities are configurable though.
  - Issues
  - Milestones
  - Labels
  - Notes (comments)
  - Attachments

## Limitations
All issues, notes, and uploads are posted by a single user. This is because of limitations with GitLab API. As a workaround, the project will add annotations in descriptions of notes and issues, so original poster can be identified.

## Dependencies
1. Node
2. NPM

## How to use it?
1. Clone the repo to your local machine.
2. `cd <project root>`
3. `npm install`
4. Rename `configuration.template.js` to `configuration.js`
5. Set your specific values to `configuration.js`
6. Run `npm start`

## How to report issues?
Use [issues](https://github.com/emumba-com/gitlab-importer/issues) tab under this repo to report any problems.

## How to contribute?
Contributions to this repo are welcome. Here are suggested steps:
1. Pick an issue from the [issues](https://github.com/emumba-com/gitlab-importer/issues) tab.
2. Fork the project and clone locally.
3. Create a new branch.
4. Make your changes in the project.
5. Commit and push.
6. Create a Pull Request at this repo.
