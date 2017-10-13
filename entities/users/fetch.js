// libs
import R from 'ramda'

// src
import { getReq, logger } from '../../utils'
import { URL_USERS } from '../../constants'
import conf from '../../configuration'
import parse from './parse'

// fetch all users
export default async ({ source }) => {
    const { sourceItems: sourceUsers } = parse({ source })
    const remoteUsers = []
    const emails = R.pluck('email', sourceUsers)

    for ( let email of emails ) {
        const remoteUser = await getReq(URL_USERS, {
            search: email
        })

        if ( remoteUser ) {
            remoteUsers.push( remoteUser )
        } else {
            logger.append(`Couldn't find user with email: ${email}`)
        }
    }

    logger.append(`Source users: ${sourceUsers.length}, remote users: ${remoteUsers.length}`)
    return remoteUsers
}