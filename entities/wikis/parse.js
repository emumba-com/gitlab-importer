// libs
import get from 'lodash/get'

// conf
import conf from '../../configuration'
import { logger } from '../../utils'

export default params => ({
    sourceItems: get(params.source, conf.source.wikis.path, []),
    ...params
})
