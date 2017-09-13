// lib
import R from 'ramda'

// src
import { postReq as __post__, serial } from '../../utils'
import conf from '../../configuration'
import { URL_MILESTONES } from '../../constants'

// TODO Ramdafy this
export default ({ localItems }) => serial(localItems.map(m => () => __post__(URL_MILESTONES, m)))