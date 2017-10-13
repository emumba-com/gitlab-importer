// libs
import R from 'ramda'

// src
import conf from '../../configuration'
import { logger, filterByField, dedupe } from '../../utils'

const { fields } = conf.source.milestones

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
    const filterOutExistingByName = R.curry(filterByField)('title', remoteItems)

    logger.append(`[entities/milestones/transform] remote items: ${remoteItems.length}`)
    // logger.append(JSON.stringify(remoteItems))
    return {
        localItems: R.pipe(dedupe('title'), R.map(transform), filterOutExistingByName)(sourceItems),
        ...params
    }
}
