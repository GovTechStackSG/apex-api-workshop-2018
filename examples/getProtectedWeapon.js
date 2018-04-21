const request = require('superagent');
const ApiSigningUtil = require('node-apex-api-security').ApiSigningUtil;
const fs = require('fs');
const path = require('path');

const ca = fs.readFileSync(path.resolve(__dirname, 'keys-certs/root-ca.crt'));

function getL1Weapon(teamName) {
    const endpoint = `https://example.api.dev/apex-dota/api/weapons/cannonball?teamName=${teamName}`;

    // In alphabetical order, required parameters for the ApiSigningUtil
    const appId = 'apex-dota-get-l1-weapon'; // App ID, obtained from the gateway
    const authPrefix = 'apex_l1_eg'; // Prefix, depending on l1/l2 or ig/eg
    const httpMethod = 'get';
    const secret = '214de883fc2fd1bad2eff6eec25e14ce4217ea81'; // App secret, obtained from the gateway

    const reqOptions = {
        appId,
        authPrefix,
        httpMethod,
        secret,
        urlPath: endpoint
    };

    const authToken = ApiSigningUtil.getSignatureToken(reqOptions);

    return request(httpMethod, endpoint)
        .ca(ca)
        .set('Authorization', authToken) // Set authorization header to token
        .send()
        .then(function(response) { // If API is successfully called
            console.log('Success!');
            console.log(response.body);
        })
        .catch(function(error) { // If API returns an error
            console.log('Error!');
            console.log(error.response ? error.response.error : error);
        });
}

function getL2Weapon(teamName) {
    const endpoint = `https://example.api.dev/apex-dota/api/weapons/dragonball?teamName=${teamName}`;

    // In alphabetical order, required parameters for the ApiSigningUtil
    const appId = 'apex-dota-get-l2-weapon';
    const authPrefix = 'apex_l2_eg';
    // Pass cert contents to: certString, or path to certificate to: certFileName
    const certString = fs.readFileSync(path.resolve(__dirname, 'keys-certs/l2-test.key'));
    const httpMethod = 'get';

    const reqOptions = {
        appId,
        authPrefix,
        certString,
        httpMethod,
        urlPath: endpoint
    };

    const authToken = ApiSigningUtil.getSignatureToken(reqOptions);

    return request(httpMethod, endpoint)
        .ca(ca)
        .set('Authorization', authToken)
        .send()
        .then(function(response) {
            console.log('Success!');
            console.log(response.body);
        })
        .catch(function(error) {
            console.log('Error!');
            console.log(error.response ? error.response.error : error);
        });
}

getL1Weapon('team1');
getL2Weapon('team1');