// libs
import R from 'ramda'

// src
import conf from '../../configuration'
import { logger, getReq } from '../../utils'

const { fields } = conf.source.labels

// removes duplicate from source data
const dedupe = R.uniqWith(R.eqBy(R.prop('id')))

// transforms source data to gitlab format
const transform = R.map(pLabel => ({
    id: conf.target.project_id,
    name: pLabel[fields.name],
    description: pLabel[fields.description],
    color: pLabel[fields.color],
    priority: pLabel[fields.priority]
}))

export default ([backupJSON, localItems, remoteItems]) => {
    const filterOutExistingByName = R.curry(R.differenceWith(R.eqBy(R.prop('name'))))(R.__, remoteItems)

    return [
        backupJSON,
        R.pipe(dedupe, transform, filterOutExistingByName)(localItems),
        remoteItems
    ]
}