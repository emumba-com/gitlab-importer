// libs
import R from 'ramda'

// src
import { URL_UPLOADS, URL_ISSUES } from '../../constants'
import { postReq, putReq, uploadFile, logger } from '../../utils'

const findIssueByIID = (issues, iid) => R.filter(R.propEq('iid', iid), issues)
const updateIssue = issue => putReq(`${URL_ISSUES}/${issue.iid}`, issue)

export default async ({ localItems, remoteIssues }) => {
    const nextLocalItems = []
    // item.file
    for ( let item of localItems ) {
        logger.append(`[entities/uploads/write] uploading file: ${item.file}`)
        const nextLocalItem = await uploadFile(URL_UPLOADS, item.file)
        logger.append(`[entities/uploads/write] upload complete: ${JSON.stringify(nextLocalItem)}`)
        const { issue_iid } = item
        const issue = findIssueByIID(remoteIssues, issue_iid)
        logger.append(`[entities/uploads/write] found issue with iid ${issue_iid}: ${JSON.stringify(issue)}`)
        issue.description =
            `${issue.description} 
            
            ${nextLocalItem.markdown}`
        await updateIssue(issue)

        nextLocalItems.push({ ...nextLocalItem, issue_iid: item.issue_iid })
    }

    return nextLocalItems
}
