const { IEXCloudClient } = require("node-iex-cloud");
const fetch = require('node-fetch-commonjs')
let secrets = require('./secrets')
let data = require('./market_data')

const iexSandboxKey = secrets.iexSandboxKey
const iexKey = secrets.iexKey

const iex = new IEXCloudClient(fetch, {
    sandbox: false,
    publishable: iexKey,
    version: "stable"
});

async function getPriceData(ticker) {
    return iex.search(ticker).then(async res => {
        if(res == undefined) {
            return undefined
        }
        for (let i = 0; i < res.length; i++) {
            if (ticker == res[i].symbol) {
                return await data.getQuote(ticker)
            }
        }
    });
}

async function getNewsData(ticker) {
    return iex.search(ticker).then(async res => {
        for (let i = 0; i < res.length; i++) {
            if (ticker == res[i].symbol) {
                return await data.getCompanyNews(ticker)
            }
        }
    })
}

module.exports.getPriceData = getPriceData
module.exports.getNewsData = getNewsData