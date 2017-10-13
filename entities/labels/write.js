// lib
import R from 'ramda'

// src
import { postReq, logger } from '../../utils'
import conf from '../../configuration'

const URL_CREATE = `/projects/${conf.target.project_id}/labels`
// const post = R.curry(__post__)(URL_MILESTONE_CREATE)

export default async ({ localItems, remoteItems }) => {
    const nextLocalItems = []

    for ( let item of localItems ) {
        nextLocalItems.push( await postReq(URL_CREATE, item) )
    }

    logger.append(`[entities/labels/write] Existing items: ${remoteItems.length}, new items: ${localItems.length}`)

    return nextLocalItems
}
