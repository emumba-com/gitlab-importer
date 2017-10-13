import { URL_NOTES } from '../../constants'
import { postReq, logger } from '../../utils'

export default async ({ localItems, remoteItems }) => {
    const nextLocalItems = []

    for ( let item of localItems ) {
        nextLocalItems.push( await postReq(URL_NOTES(item.issue_iid), item) )
    }

    logger.append(`[entities/notes/write] Existing items: ${remoteItems.length}, new items: ${localItems.length}`)

    return nextLocalItems
}
