import { URL_ISSUES } from '../../constants'
import { postReq, logger } from '../../utils'

export default async ({ localItems, remoteItems }) => {
    const nextLocalItems = []

    for ( let item of localItems ) {
        nextLocalItems.push( await postReq(URL_ISSUES, item) )
    }

    logger.append(`[entities/issues/write] Existing items: ${remoteItems.length}, new items: ${localItems.length}`)

    return nextLocalItems
}
