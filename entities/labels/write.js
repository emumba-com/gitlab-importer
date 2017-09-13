// lib
import R from 'ramda'

// src
import { postReq as __post__, serial, logger } from '../../utils'
import conf from '../../configuration'

const URL_CREATE = `/projects/${conf.target.project_id}/labels`
// const post = R.curry(__post__)(URL_MILESTONE_CREATE)

export default ([backupJSON, localLabels, remoteLabels]) => serial(localLabels.map(m => () => __post__(URL_CREATE, m)))