// libs
import R from 'ramda'

// src
import { resolveFieldValue, buildTargetObject, filterByField } from '../../utils'

const targetFields = [
    'issue_iid',
    'body',
    'created_on'
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
    const transform = R.map(R.curry(buildTargetObject)(helpers, 'notes', targetFields))
    const filterOutOrphans = R.filter(({issue_iid}) => issue_iid)
    const filterOutExistingByContent = R.curry(filterByField)('body', remoteItems)

    return {
        localItems: R.pipe(transform, filterOutOrphans, filterOutExistingByContent)(sourceItems),
        ...params
    }
}