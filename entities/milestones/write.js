// lib
import R from 'ramda'

// src
import { postReq, logger } from '../../utils'
import conf from '../../configuration'
import { URL_MILESTONES } from '../../constants'

// TODO Ramdafy this
export default async ({ localItems, remoteItems }) => {
    // serial(localItems.map(m => () => __post__(URL_MILESTONES, m)))

    for ( let localItem of localItems ) {
        try {
            await postReq(URL_MILESTONES, localItem)
        } catch (e) {
            logger.append(`[entities/milestones/write] Couldn't create ${localItem.title}`)
        }
    }

    logger.append(`[entities/milestones/write] Existing items: ${remoteItems.length}, new items: ${localItems.length}`)
}