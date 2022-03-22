// get the quote (last price) for a stock
function getQuote(ticker) {
    alpaca.lastQuote(ticker).then((resp) => {
        console.log(resp)
    });
}

function getQuote(ticker) {
    fetch(alpacaDataBaseURL + `/v2/stocks/${ticker}/quotes`).then(resp => {
        if (!resp.ok) {
            throw new Error(`Request failed with status ${reponse.status}`)
        }
        return resp.json()
    });
}

function getQuote(ticker) {
    finnhubClient.quote(ticker, (error, data, resp) => {
        if (error) {
            console.error(error)
            throw error
        }
        console.log(data)
        return data
    });
} 

// test func to see if alpaca conn works
function getAccount() {
    alpaca.getAccount().then((account) => {
        console.log('Current Account:', account)
    });
}

// endpoint to get user by name
app.post('/api/users/:name', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            connection.release()
            console.log('Error getting connection from pool: ' + err)
            throw err
        }
        let name = req.params.name;
        let firstName = undefined
        let lastName = undefined
        if (typeof name !== 'undefined') {
            let splitName = name.split(' ')
            firstName = splitName[0]
            lastName = splitName[1]
        }
        else {
            res.status(400).send('Must provide first + last name separated by a single space in request params')
        }
        rdb.query("SELECT * FROM stock_central.users WHERE first_name = '" + firstName + "' AND last_name = '" + lastName + "'", function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            res.send(result)
        });
    });
});


// var alpacaBaseURL = secrets.alpacaBaseURL
// var alpacaDataBaseURL = secrets.alpacaDataBaseURL
// var alpaca = secrets.alpaca

// const finnhub = require('finnhub');
// const api_key = finnhub.ApiClient.instance.authentications["api_key"];
// api_key.apiKey = secrets.finnhubAPIKey // Replace this
// const finnhubClient = new finnhub.DefaultApi()

