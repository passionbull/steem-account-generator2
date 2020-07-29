# steem-account-generator


## local test
* npm install
* npm start

## open new terminal 
* cd client
* npm install
* npm start


## heroku setup
* heroku login
* heroku create steem-account-generator

## heroku deploy api server
* heroku login
* heroku git:remote -a steem-account-generator
* git push heroku master

## setting heroku config var
* heroku config:set creatorAccount=steem_account
* heroku config:set creatorAccountPW=your_active_key
