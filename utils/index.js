// libs
import fs from 'fs'
import request from 'request-promise-native'

// src
import conf from '../configuration'
import logger from './logger'

export { default as logger } from './logger'

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

export const postReq = async (pUri, body) => {
    const uri = makeURL(pUri)
    logger.append(`Sending POST request to: ${uri}`)
    // logger.append(body)

    const res = await request({
        uri,
        method: 'POST',
        headers: {
            'PRIVATE-TOKEN': conf.target.privateToken
        },
        body,
        json: true,
        resolveWithFullResponse: true
    })

    // logger.append(res)

    return res.body
}

export const getReq = async (pUri, qs) => {
    const uri = makeURL(pUri)
    logger.append(`Sending GET request to: ${uri}`)

    const res = await request({
        uri,
        qs,
        headers: {
            'PRIVATE-TOKEN': conf.target.privateToken
        },
        json: true
    })

    return res
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