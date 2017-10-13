// libs
import path from 'path'
import get from 'lodash/get'

// src
import { readFile, logger, getRequestCount, getReq, deleteReq } from './utils'
import conf from './configuration'

import createMilestones from './entities/milestones'
import createLabels from './entities/labels'
import createUsers from './entities/users'
import createIssues from './entities/issues'
import createNotes from './entities/notes'
import createUploads from './entities/uploads'
import createWikis from './entities/wikis'

import fetchIssues from './entities/issues/fetch'

const clearIssues = async () => {
    const line = logger.append(`Reading backup file ...`)

    const issues = await fetchIssues()
    
    for ( let issue of issues ) {
        line.update(`Deleting issue ${issue.iid}`)
        await deleteReq(`/projects/${conf.target.project_id}/issues/${issue.iid}`)
    }
}

(async () => {
//    await clearIssues()
//    return

    try {
        const startTimestamp = Date.now()
        const line = logger.append(`Reading backup file ...`)
        const backupString = await readFile( conf.source.filename )

        line.update('Parsing backup data ...')
        const backupJSON = JSON.parse(backupString)

        // get list of users that are engaged in this project
        line.update('Fetching users ...')
        const users = await createUsers(backupJSON)

        // doesn't require users
        line.update('Creating milestones ...')
        const milestones = await createMilestones(backupJSON)

        // doesn't require users
        line.update('Creating labels ...')
        const labels = await createLabels(backupJSON)

        // requires users
        // assignee IDs
        line.update('Creating issues ...')
        const issues = await createIssues(backupJSON, users, milestones, labels)
        
        logger.append(`[index] Issues downloaded: ${issues && issues.length}`)

        line.update('Creating notes ...')
        const notes = await createNotes(backupJSON, users, issues)

        line.update('Uploading attachments ...')
        const uploads = await createUploads(backupJSON, issues)

        line.update('Creating wiki pages ...')
        const wikis = await createWikis(backupJSON, users)

        const duration = (Date.now() - startTimestamp) / 1000
        line.update(`Project uploading completed in ${ duration } seconds and ${ getRequestCount() } requests`)
    } catch(e) {
        console.log(`An error occurred: `, e)
        console.log(e.stack)
    }
})()


// create tags/labels
// create tickets
    // create ticket comments
    // create ticket tags/labels
    // create ticket associations
    // upload attachments

// create wiki pages
    // create wiki versions