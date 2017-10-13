import { getReq, logger } from '../../utils'
import { URL_NOTES } from '../../constants'

export default async ({ remoteIssues }) => {
    const remoteNotes = []

    logger.append(`[entities/notes/fetch] remoteIssues: ${remoteIssues && remoteIssues.length}`)

    for ( let issue of remoteIssues ) {
        remoteNotes.push(await getReq( URL_NOTES(issue.iid) ))
    }

    return remoteNotes
}