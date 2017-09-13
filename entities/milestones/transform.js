// libs
import R from 'ramda'

// src
import conf from '../../configuration'
import { logger } from '../../utils'

const { fields } = conf.source.milestones

// removes duplicate from source data
const dedupe = R.uniqWith(R.eqBy(R.prop('id')))

// transforms data from source format to gitlab format
const transform = pMilestone => ({
    id: conf.target.project_id,
    title: pMilestone[fields.title],
    description: pMilestone[fields.description],
    due_date: pMilestone[fields.due_date],
    start_date: pMilestone[fields.start_date]
})

export default params => {
    const { sourceItems, remoteItems } = params
    const filterOutExistingByName = R.curry(R.differenceWith(R.eqBy(R.prop('title'))))(R.__, remoteItems)

    return {
        localItems: R.pipe(dedupe, R.map(transform), filterOutExistingByName)(sourceItems),
        ...params
    }
}