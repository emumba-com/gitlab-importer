// lib
import R from 'ramda'

// src
import fetch from './fetch'
import parse from './parse'
import transform from './transform'
import write from './write'
import { debugPipeline, logger } from '../../utils'

const create = R.pipe(parse, transform, write)

export default async backupJSON => {
    await create([backupJSON, null, await fetch()])
    return await fetch()
}