// libs
import R from 'ramda'

// src
import { resolveFieldValue, buildTargetObject, filterByField, logger } from '../../utils'

const targetFields = [
    'issue_iid',
    'file'
]

export default params => {
    const { sourceItems, remoteItems } = params

    // helpers is an object, that carries data useful for field resolution
    
    // items to be added:
    // - source (aka original source JSON)
    // - remoteUsers
    // - remoteMilestones
    // - remoteLabels

    // assume that all of above helpers are already present in the params
    const helpers = { ...params }
    const transform = R.map(R.curry(buildTargetObject)(helpers, 'uploads', targetFields))
    const removeOrphans = R.reject(R.propEq('issue_iid', null))
    const localItems = R.pipe(transform, removeOrphans)(sourceItems)
    logger.append(`[entities/uploads/transform] transformed: ${JSON.stringify(localItems)}`)

    // const filterOutExistingByContent = R.curry(filterByField)('body', remoteItems)

    return {
        localItems,
        ...params
    }
}