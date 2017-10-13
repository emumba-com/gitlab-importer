// lib
import R from 'ramda'

// src
import fetch from './fetch'
import parse from './parse'
import transform from './transform'
import write from './write'
import { logger } from '../../utils'

const create = R.pipe(parse, transform, write)

/**
 * source = backup JSON
 * sourceItems = milestones listed in backup JSON
 * remoteItems = existing milestones at remote server
 * localItems = milestones to be created at remote server
 */
// users, milestones, labels)
export default async (source, remoteUsers, remoteMilestones, remoteLabels) => {
    await create({
        source,
        remoteUsers,
        remoteMilestones,
        remoteLabels,
        remoteItems: await fetch()
    })

    return await fetch()
}
