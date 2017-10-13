import { URL_WIKIS } from '../../constants'
import { postReq } from '../../utils'

export default async ({ localItems }) => {
    const nextLocalItems = []

    for ( let item of localItems ) {
        nextLocalItems.push( await postReq(URL_WIKIS, item) )
    }

    return nextLocalItems
}
