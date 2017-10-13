import { URL_UPLOADS, URL_ISSUES } from '../../constants'
import { postReq, putReq } from '../../utils'

const findIssueByIID = (issues, iid) => R.filter(R.propEq('iid', iid), issues)
const updateIssue = issue => putReq(`${URL_ISSUES}/${issue.iid}`, issue)

export default async ({ localItems, remoteIssues }) => {
    const nextLocalItems = []

    for ( let item of localItems ) {
        const nextLocalItem = await postReq(URL_UPLOADS, item)
        const { issue_iid } = item
        const issue = findIssueByIID(remoteIssues, issue_iid)
        issue.description =
            `${issue.description} 
            
            ${nextLocalItem.markdown}`
        await updateIssue(issue)

        nextLocalItems.push({ ...nextLocalItem, issue_iid: item.issue_iid })
    }

    return nextLocalItems
}
