import { getReq, logger } from '../../utils'
import { URL_LABELS } from '../../constants'

export default async () => {
    const labels = await getReq(URL_LABELS)
    return labels
}