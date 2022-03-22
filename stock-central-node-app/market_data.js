const { IEXCloudClient } = require("node-iex-cloud");
const fetch = require('node-fetch-commonjs')
let secrets = require('./secrets');


const iexSandboxKey = secrets.iexSandboxKey
const iexKey = secrets.iexKey
const iexBaseURL = secrets.iexBaseURL

const iex = new IEXCloudClient(fetch, {
    sandbox: false,
    publishable: secrets.iexKey,
    version: "stable"
});

// retrieves company news for last 5 days
async function getQuote(ticker) {
    return iex.symbol(ticker).quote().then(res => {
        return res
    })
}

// retrieves 3 of the company's recent headlines
async function getCompanyNews(ticker) {
    return iex.symbol(ticker).news(3).then(res => {
        return res
    });
}


module.exports.getQuote = getQuote
module.exports.getCompanyNews = getCompanyNews