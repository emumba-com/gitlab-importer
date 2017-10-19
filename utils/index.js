// libs
import fs from 'fs'
import request from 'request-promise-native'
import R from 'ramda'

// src
import conf from '../configuration'
import logger from './logger'

export { default as logger } from './logger'

let requestCount = 0

export const readFile = fileName =>
    new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) reject(err)
            resolve(data)        
        })
    })

export const writeFile = (fileName, data) =>
    new Promise((resolve, reject) => {
      fs.writeFile(fileName, data, 'utf8', (err) => {
          if (err) reject(err)
          else resolve(data)
      })
    })

// courtesy: https://stackoverflow.com/a/3710226/162461
export const isJSON = str => {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

const makeURL = uri => `https://${conf.target.host}/api/${conf.target.version}${uri}`

export const postReq = async (pUri, body, pOptions = {}) => {
    const uri = makeURL(pUri)
    const options = {
        uri,
        method: 'POST',
        body,
        json: true,
        resolveWithFullResponse: true,
        headers: {},
        ...pOptions
    }

    options.headers = {
        ...options.headers,
        'PRIVATE-TOKEN': conf.target.privateToken,
    }

    logger.append(`Sending POST request to: ${uri}`)
    // logger.append(body)

    const res = await request(options)
    requestCount++
    // logger.append(res)

    return res.body
}

export const uploadFile = async (uri, filepath) =>
    postReq(uri, '', {
        formData: {
            file: fs.createReadStream(filepath)
        },
        json: false
    })

export const putReq = async (pUri, body) => {
    const uri = makeURL(pUri)
    logger.append(`Sending PUT request to: ${uri}`)
    // logger.append(body)

    const res = await request({
        uri,
        method: 'PUT',
        headers: {
            'PRIVATE-TOKEN': conf.target.privateToken
        },
        body,
        json: true,
        resolveWithFullResponse: true
    })

    requestCount++
    // logger.append(res)

    return res.body
}

export const deleteReq = async (pUri, body) => {
    const uri = makeURL(pUri)
    logger.append(`Sending DELETE request to: ${uri}`)
    // logger.append(body)

    const res = await request({
        uri,
        method: 'DELETE',
        headers: {
            'PRIVATE-TOKEN': conf.target.privateToken
        },
        body,
        json: true,
        resolveWithFullResponse: true
    })

    requestCount++
    // logger.append(res)

    return res.body
}

const __getReq__ = async (pUri, qs) => {
    const uri = makeURL(pUri)
    // logger.append(`Sending GET request to: ${uri}`)

    const res = await request({
        uri,
        qs,
        headers: {
            'PRIVATE-TOKEN': conf.target.privateToken
        },
        json: true,
        resolveWithFullResponse: true
    })

    requestCount++

    return res
}

export const getReq = async (pUri, qs) => {
    const response = await __getReq__(pUri, qs)

    if ( !response.body ) {
        throw `[utils/getReq] Response doesn't have a body`
    }

    return response.body
}

export const getReqGP = async (uri, externalOptions = {}) => {
    const options = {
        page: 1,
        per_page: 10,
        ...externalOptions
    }

    let output = []

    // dupchecks
    // const map = {}

    // let response
    let page = options.page
    let statusCode = 200
    let body

    const line = logger.append(`[utils/getReqGP][GET] ${uri} / page=${page} / output.length=${output.length}`)

    do {
        const response = await __getReq__(uri, { ...options, page })
        statusCode = response.statusCode
        body = response.body

        if ( body ) {
            output = output.concat(body)
        }

        line.update(`[utils/getReqGP][GET] ${uri} / page=${page} / output.length=${output.length}`)

        page++
    } while ( body && body.length )

    return output
}


/**
 * copied from here: https://stackoverflow.com/a/41115086/162461
 * 
 * serial executes Promises sequentially.
 * @param {Array<Function>} funcs array of funcs that return promises.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * serial(urls.map(url => () => $.ajax(url)))
 *     .then(console.log.bind(console))
 */
export const serial = funcs =>
    funcs.reduce(
    (promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
    )

export const debugPipeline = args => {
    logger.append(`debugPipeline: ${JSON.stringify(args)}`)
}

const resolveFieldValue = (helpers, entityKey, fieldKey, sourceItem) => {
    const resolver = conf.source[entityKey].fields[fieldKey]
    const resolverType = R.type(resolver)
    // logger.append(`entityKey: ${entityKey}, fieldKey: ${fieldKey}, resolverType: ${resolverType}`)

    if ( resolverType === 'String' ) {
        return sourceItem[resolver]
    }

    if ( resolverType !== 'Function' ) {
        return null
    }

    return resolver({ ...helpers, sourceItem })
}

export const buildTargetObject = (helpers, entityKey, targetFields, sourceItem) =>
    R.reduce((output, fieldKey) => {
            output[fieldKey] = resolveFieldValue(helpers, entityKey, fieldKey, sourceItem)
            return output
        }, {
            id: conf.target.project_id
        }, targetFields
    )

// returns arrayB - arrayA
// removing items that are present in targetItems
export const filterByField = (fieldKey, arrayA, arrayB) => {
    writeFile('/Users/umar/Desktop/arrayA.json', JSON.stringify(arrayA))
    writeFile('/Users/umar/Desktop/arrayB.json', JSON.stringify(arrayB))

    return R.differenceWith((a, b) => {
        
        // const r = a[fieldKey].indexOf(b[fieldKey]) > 0 || b[fieldKey].indexOf(a[fieldKey]) > 0
        const r = a[fieldKey] === b[fieldKey]

        /*
        if ( r ) {
            
        }
        */
        // logger.append(`[filterByField] comparison "${a[fieldKey]}" === "${b[fieldKey]}": ${r}`)

        return r
    }, arrayB, arrayA)
}

export const dedupe = propKey => R.uniqWith(R.eqBy(R.prop(propKey)))

export const getRequestCount = () => requestCount