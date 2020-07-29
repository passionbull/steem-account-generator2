const dsteem = require('dsteem');
const client = new dsteem.Client('https://api.steemit.com');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';

const steemapi = {

    async delegateSteemPower(username, delegateSteem, creatorAccount, creatorAccountPassword){
        const privateKey = dsteem.PrivateKey.fromString(
            creatorAccountPassword
        );
        const op = [
            'delegate_vesting_shares',
            {
                delegator: creatorAccount,
                delegatee: username,
                vesting_shares: delegateSteem,
            },
        ];
        try {
            var result = await client.broadcast.sendOperations([op], privateKey);
            return result;
        } catch (error) {
            return undefined;
        }
    },
    async searchAccount(username) {
        try {
            let avail = false;
            const _account = await client.database.call('get_accounts', [
                [username],
            ]);
            if (_account.length == 0) {
                avail = true;
            }
            return avail;
        } catch (error) {
            return false;
        }
    },
    async showAccountClaimedToken(username){
        try {
            const _account = await client.database.call('get_accounts', [[username]]);
            return _account[0].pending_claimed_accounts*1;
        } catch (error) {
            return 0;
        }
    },
    async claimAccountToken(creatorAccount, creatorAccountPassword){
        try {
            const privateKey = dsteem.PrivateKey.fromString(
                creatorAccountPassword
            );
            let ops = [];
            const claim_op = [
                'claim_account',
                {
                    creator: creatorAccount,
                    fee: '0.000 STEEM',
                    extensions: [],
                },
            ];
            ops.push(claim_op);
            var results = await client.broadcast.sendOperations(ops, privateKey);
            return results;
        } catch (error) {
            return undefined;
        }

    },
    async createAccount(username, password, creatorAccount, creatorAccountPassword){

        //private active key of creator account
        const privateKey = dsteem.PrivateKey.fromString(
            creatorAccountPassword
        );

        //create keys
        const ownerKey = dsteem.PrivateKey.fromLogin(username, password, 'owner');
        const activeKey = dsteem.PrivateKey.fromLogin(username, password, 'active');
        const postingKey = dsteem.PrivateKey.fromLogin(
            username,
            password,
            'posting'
        );
        const memoKey = dsteem.PrivateKey.fromLogin(
            username,
            password,
            'memo'
        ).createPublic(opts.addressPrefix);
    
        const ownerAuth = {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[ownerKey.createPublic(opts.addressPrefix), 1]],
        };
        const activeAuth = {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[activeKey.createPublic(opts.addressPrefix), 1]],
        };
        const postingAuth = {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[postingKey.createPublic(opts.addressPrefix), 1]],
        };

        let ops = [];
        // check the number of token

        const _account = await client.database.call('get_accounts', [[creatorAccount]]);
        if(_account[0].pending_claimed_accounts == 0)
            return undefined;
    
        //create operation to transmit
        const create_op = [
            'create_claimed_account',
            {
                creator: creatorAccount,
                new_account_name: username,
                owner: ownerAuth,
                active: activeAuth,
                posting: postingAuth,
                memo_key: memoKey,
                json_metadata: '',
                extensions: [],
            },
        ];
        console.log(create_op);
        ops.push(create_op);
        //broadcast operation to blockchain
        const results = await client.broadcast.sendOperations(ops, privateKey);
        return [results, create_op];
    }
};
  

module.exports = steemapi;
