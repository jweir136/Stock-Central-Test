const alpacaKeyID = 'PK0Q4IXQFMVRN8VX6FMH'
const alpacaSecretKey = 'uYFzWmR4JvrzWZVqHiPI9o3MAUwGZfRpKmZBJKvv'

const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca({
    keyId: alpacaKeyID,
    secretKey: alpacaSecretKey,
    paper: true,
});

const alpacaBaseURL = 'https://paper-api.alpaca.markets'
const alpacaDataBaseURL = 'https://data.alpaca.markets/v2'

const finnhubAPIKey = 'c6grfpqad3iej642uqeg'

const iexSandboxKey = "Tpk_12e6eee6ed7d4026a0a87dee063b86bd"
const iexKey = 'pk_4a09995ad6854e28a38018bdd36eb410'
const iexBaseURL = 'https://sandbox.iexapis.com/'

module.exports.iexSandboxKey = iexSandboxKey
module.exports.iexKey = iexKey
module.exports.iexBaseURL = iexBaseURL


module.exports.alpaca = alpaca
module.exports.alpacaKeyID = alpacaKeyID
module.exports.alpacaSecretKey = alpacaSecretKey
module.exports.alpacaDataBaseURL = alpacaDataBaseURL
module.exports.alpacaBaseURL = alpacaBaseURL

module.exports.finnhubAPIKey = finnhubAPIKey