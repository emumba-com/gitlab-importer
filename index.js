// libs
import path from 'path'
import get from 'lodash/get'

// src
import { readFile, logger, getRequestCount, getReq } from './utils'
import conf from './configuration'

import createMilestones from './entities/milestones'
import createLabels from './entities/labels'
import createUsers from './entities/users'
import createIssues from './entities/issues'
import createNotes from './entities/notes'
import createUploads from './entities/uploads'
import createWikis from './entities/wikis'

(async () => {
    try {
        const startTimestamp = Date.now()
        const line = logger.append(`Reading backup file ...`)
        const backupString = await readFile( conf.source.filename )

        line.update('Parsing backup data ...')
        const backupJSON = JSON.parse(backupString)

        // line.update('Creating users ...')
        // const users = await createUsers(backupJSON)

        line.update('Creating milestones ...')
        const milestones = await createMilestones(backupJSON)
        logger.append(`Total milestones: ${JSON.stringify(milestones)}`)

        // line.update('Creating labels ...')
        // const labels = await createLabels(backupJSON)

        // logger.append(`Total Labels: ${JSON.stringify(labels)}`)
        /*
        line.update('Creating issues ...')
        const issues = await createIssues(backupJSON, users, milestones, labels)

        line.update('Creating notes ...')
        const notes = await createNotes(backupJSON, users, issues)

        line.update('Uploading attachments ...')
        const uploads = await createUploads(backupJSON, issues)

        line.update('Creating wiki pages ...')
        const wikis = await createWikis(backupJSON, users)

        const duration = (Date.now() - startTimestamp) / 1000
        line.update(`Project uploading completed in ${ duration } seconds and ${ getRequestCount() } requests`)
        */
    } catch(e) {
        logger.append(`An error occurred: `, e)
        logger.append(e.stack)
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