// libs
import R from 'ramda'

// src
import { resolveFieldValue, buildTargetObject, filterByField, logger } from '../../utils'

const targetFields = [
    'title',
    'description',
    'assignee_ids',
    'milestone_id',
    'labels',
    'created_at',
    'due_data'
]

export default params => {
    const { sourceItems, remoteItems } = params

    // helpers is an object, that carries data useful for field resolution
    
    // items to be added:
    // - source (aka original source JSON)
    // - remoteUsers
    // - remoteMilestones
    // - remoteLabels

    logger.append(`[transform] remoteItems: ${remoteItems.length}`)

    // assume that all of above helpers are already present in the params
    const helpers = { ...params }
    const transform = R.map(R.curry(buildTargetObject)(helpers, 'issues', targetFields))
    const filterOutExistingByName = R.curry(filterByField)('title', remoteItems)
    const localItems = R.pipe(transform, items => {
        logger.append(`beforeFilter: "${items[0].title}"`)
        logger.append(`beforeFilter: ${items.length}`)
        return items
    }, filterOutExistingByName, items => {
        logger.append(`afterFilter: "${items[0].title}"`)
        logger.append(`afterFilter: ${items.length}`)
        return items
    })(sourceItems)
    // logger.append(JSON.stringify(localItems))

    return {
        localItems,
        ...params
    }
}