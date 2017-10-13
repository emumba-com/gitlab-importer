// libs
import R from 'ramda'
import path from 'path'

import conf from '../configuration'
import { logger } from '../utils'

const extractTagNames = parent_id => R.pipe(R.filter(t => t.parent_id === parent_id), R.map(({name}) => name))

const remoteEntityMaps = {}

const getRemoteEntity = (entityKey, remoteEntities, remoteEntityJoinFieldKey, sourceEntities, sourceEntityJoinFieldKey, sourceEntity) => {
    if ( !remoteEntityMaps[entityKey] ) {
        const groupedRemoteEntities = R.groupBy(remoteEntity => remoteEntity[remoteEntityJoinFieldKey], remoteEntities)
        remoteEntityMaps[entityKey] = R.reduce((output, sourceEntity) => {
            const x = groupedRemoteEntities[sourceEntity[sourceEntityJoinFieldKey]]
            output[sourceEntity.id] = x && x.length && x[0]
            return output
        }, {}, sourceEntities)
    }

    return remoteEntityMaps[entityKey][sourceEntity.id]
}

export const mapIssueFieldAssigneeIDs = ({ source, sourceItem, remoteUsers }) => {
    const { assigned_to_id } = sourceItem
    const remoteUser = getRemoteEntity('users', remoteUsers, 'email', source.users, 'email', { id: assigned_to_id })

    return remoteUser ? [ remoteUser.id ] : []
}

export const mapIssueFieldMilestoneID = ({ source, sourceItem, remoteMilestones }) => {
    const { milestone_id } = sourceItem
    const milestone = getRemoteEntity('milestones', remoteMilestones, 'title', source.milestones, 'title', { id: milestone_id })

    return milestone && milestone.id
}

export const mapIssueFieldLabels = ({ source, sourceItem }) => {
    const { id } = sourceItem
    const { ticketTags } = source
    const output = extractTagNames(id)(ticketTags).join(',')
    const childTicketTags = R.filter(t => t.parent_id === id, ticketTags)
    
    // logger.append(`ticketTags: [${childTicketTags && childTicketTags.length}], outputTags: ${output}, ticketSummary: ${sourceItem.summary}`)
    // logger.append(JSON.stringify(sourceItem))

    return output
}

export const mapNotesFieldIssueIID = ({ source, sourceItem, remoteIssues }) => {
    const { ticket_id } = sourceItem
    const issue = getRemoteEntity('issues', remoteIssues, 'title', source.tickets, 'summary', { id: ticket_id })

    return issue && issue.iid
}

// TODO implement this function
export const mapUploadFieldFile = ({ source, sourceItem, remoteIssues }) => {
    // return filename
    const filename = sourceItem.ticket_id
        ? `__TicketID ${sourceItem.ticket_id}__${sourceItem.filename}`
        : `__ID ${sourceItem.id}__${sourceItem.filename}`

    return path.join(conf.source.uploads.directory, filename)
}

export const mapUploadFieldIssueID = ({ source, sourceItem, remoteIssues }) => {
    const { ticket_id } = sourceItem
    const issue = getRemoteEntity('issues', remoteIssues, 'title', source.tickets, 'summary', { id: ticket_id })

    return issue && issue.id
}
