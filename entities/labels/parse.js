// libs
import get from 'lodash/get'

// conf
import conf from '../../configuration'
import { logger } from '../../utils'

export default ([backupJSON, localLables, remoteLabels]) => {
    return [backupJSON, get(backupJSON, conf.source.labels.path, []), remoteLabels]
}
