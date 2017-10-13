import { getReq, logger } from '../../utils'
import { URL_WIKIS } from '../../constants'

export default async () => {
    const labels = await getReq(URL_WIKIS)
    return labels
}
