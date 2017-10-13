// libs
import R from 'ramda'

// src
import conf from '../../configuration'
import { logger, getReq, filterByField, dedupe } from '../../utils'

const { fields } = conf.source.labels

// removes duplicate from source data
// const dedupe = R.uniqWith(R.eqBy(R.prop('id')))

// transforms source data to gitlab format
const transform = R.map(pLabel => ({
    id: conf.target.project_id,
    name: pLabel[fields.name],
    description: pLabel[fields.description],
    color: pLabel[fields.color],
    priority: pLabel[fields.priority]
}))

export default params => {
    const { sourceItems, remoteItems } = params
    const filterOutExistingByName =  R.curry(filterByField)('name', remoteItems)

    return {
        localItems: R.pipe(dedupe('name'), transform, filterOutExistingByName)(sourceItems),
        ...params
    }
}