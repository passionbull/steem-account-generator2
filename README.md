# steem-account-generator


## step by step
npm install
npm start


## heroku setup
heroku login
heroku create steem-account-generator

## heroku deploy api server
heroku login
heroku git:remote -a steem-account-generator
git push heroku master

## setting heroku config var
heroku config:set creatorAccount=jacobyu
heroku config:set creatorAccountPW=12345abcdefg
