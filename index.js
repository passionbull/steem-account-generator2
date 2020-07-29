const express = require('express')
const cowsay = require('cowsay')
const cors = require('cors')
const path = require('path')

const { 
    searchAccount,
    showAccountClaimedToken,
    claimAccountToken,
    createAccount,
    delegateSteemPower
} = require("./steemapi.js");
var creatorAccount = process.env.creatorAccount;
var creatorAccountPW = process.env.creatorAccountPW;

// Create the server
const app = express()


// Serve our base route that returns a Hellow World cow
app.get('/api/cow/', cors(), async (req, res, next) => {
  try {
    const moo = cowsay.say({ text: 'Hello World!' })
    res.json({ moo })
  } catch (err) {
    next(err)
  }
})


app.get("/delegatePower", cors(), async (req, res) => {
    var account = {
        name : req.query.id,
        pw: req.query.power,
        success: false,
        info: ''
    }

    var delegate_result = await delegateSteemPower(name,pw, creatorAccount,creatorAccountPW);
    result.info = delegate_result
    res.json({ result });
});



app.get("/claimACT", cors(), async (req, res) => {
    var result = {
        info: ''
    }
    var r = await claimAccountToken(creatorAccount,creatorAccountPW);
    result.info = r;
    result.token = await showAccountClaimedToken(creatorAccount);
    res.json({ result });
});


app.get("/signin", cors(), async (req, res) => {

    var account = {
        name : req.query.id,
        pw: req.query.pw,
        success: false,
        info: ''
    }
    // check that account already is exist or not
    var avail = await searchAccount(account.name);
    if(avail) {
        var TheNumberofToken = await showAccountClaimedToken(creatorAccount);
        if(TheNumberofToken>0){
            // create account
            try {
                var r = await createAccount(account.name,account.pw,creatorAccount,creatorAccountPW);
                console.log(r);
                account.success = true;
                account.info = r[1];
            } catch (error) {
                console.log(error);
                account.info = 'creating account is fail.'
            }
        }
        else{
            var r = await claimAccountToken(creatorAccount,creatorAccountPW);
            account.info = 'creating account is fail.'
        }
    }
    else {
        account.info = 'this account is already used.'
    }
    console.log('result',account);
    res.json({ account });
});

// Choose the port and start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`)
})
