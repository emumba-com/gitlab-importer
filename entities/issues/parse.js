// libs
import get from 'lodash/get'

// conf
import conf from '../../configuration'

export default params =>
    ({
        sourceItems: get(params.source, conf.source.issues.path, []),
        ...params
    })
