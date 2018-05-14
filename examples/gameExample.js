// Work your way down the file to learn about the various functions you'd need to play this game
// Libraries
const fs = require('fs');
const path = require('path');
// We will use superagent as our HTTP request library, see https://visionmedia.github.io/superagent/
const request = require('superagent'); 
// Library used for signing L1 and L2 API calls
const ApiSigningUtil = require('node-apex-api-security').ApiSigningUtil;

// Load the key required for signing L2 API calls
const dragonballKey = fs.readFileSync(path.resolve(__dirname, 'keys-certs/l2-auth-key.pem')); 

// We will hit the API at this endpoint
let endpointHost = 'https://training.api.gdshive.com/apex-dota';

// When constructing signatures, we need to use this endpoint instead
let signingHost = 'https://training.api.lab/apex-dota'; 

// API call functions. 
// These functions make use of Javascript promises (https://developers.google.com/web/fundamentals/primers/promises)

// If a call fails, it will be printed to the console
function printError(error) {
    console.log(error.response ? error.response.error : error);
}

/**
 * Fetch information on all teams
 *
 * @returns {Promise<array>} An array of objects containing team information
 */
function getAllTeamsStatuses() {
    return request.get(`${endpointHost}/api/teams/status`)
        .then(function(response) {
            return response.body;
        })
        .catch(printError);
}

/**
 * Fetch information on a particular team
 *
 * @param {string} teamName Name of team
 * @returns {Promise} Team information
 */
function getTeamStatus(teamName) {
    return request.get(`${endpointHost}/api/teams/${teamName}/status`)
        .then(function(response) {
            return response.body;
        })
        .catch(printError);
}

/**
 * Fetches some snowballs for a particular team
 *
 * @param {string} teamName Name of team
 * @returns {Promise} Updated team information
 */
function getSnowBall(teamName) {
    return request.put(`${endpointHost}/api/weapons/snowball`)
        .send({
            teamName: teamName
        })
        .then(function(response) {
            return response.body;
        })
        .catch(printError);
}

/**
 * Fetches some cannon balls for a particular team
 *
 * @param teamName
 * @returns {Promise} Updated team information
 */
function getCannonBall(teamName) {
    // The actual endpoint URL we want to hit (proxies to the API gateway's endpoint)
    let endpoint = `${endpointHost}/api/weapons/cannonball`;
    // The API gateway's API endpoint, for signing
    let signingEndpoint = `${signingHost}/api/weapons/cannonball`;

    // Required parameters for the ApiSigningUtil

    // Use the blacksmith APIs to obtain the following 2 L1 authentication parameters
    const appId = ''; // Apex App ID set at Apex gateway.
    const secret = ''; // App secret, set at Apex gateway.

    // Prefix, follows format of apex_(l1 or l2)_(ig or eg) depending on l1 or l2 auth, and intranet (ig) or internet (eg) gateway
    const authPrefix = 'apex_l1_eg';
    const httpMethod = 'put'; // API uses HTTP PUT

    const reqOptions = {
        appId,
        authPrefix,
        httpMethod,
        secret,
        urlPath: signingEndpoint
    };

    const authToken = ApiSigningUtil.getSignatureToken(reqOptions);
    
    return request(httpMethod, endpoint)
        .set('authorization', authToken) // Set authorization header to token
        .send({
            teamName: teamName
        })
        .then(function(response) { // If API is successfully called
            return response.body
        })
        .catch(printError);
}

/**
 * Fetches some dragon balls for a team
 *
 * @param teamName
 * @returns {Promise<object>} Updated team information
 */
function getDragonBall(teamName) {
    // The actual endpoint URL we want to hit (proxies to the API gateway's endpoint)
    let endpoint = `${endpointHost}/api/weapons/dragonball`;
    // The API gateway's API endpoint, for signing
    let signingEndpoint = `${signingHost}/api/weapons/dragonball`;

    // Required parameters for the ApiSigningUtil

    // Use the blacksmith APIs to obtain the following 2 L2 authentication parameters
    const appId = ''; // Apex App ID set at Apex gateway.
    const keyString = ''; // Private key used to authenticate with Apex App

    const authPrefix = 'apex_l2_eg';
    const httpMethod = 'put';

    const reqOptions = {
        appId,
        authPrefix,
        keyString,
        httpMethod,
        urlPath: signingEndpoint
    };

    const authToken = ApiSigningUtil.getSignatureToken(reqOptions);

    return request(httpMethod, endpoint)
        .set('authorization', authToken)
        .send({
            teamName: teamName
        })
        .then(function(response) {
            return response.body;
        })
        .catch(printError);
}

/**
 * Fetch challenge to solve to obtain L1 or L2 secrets
 *
 * @param {number} level: 1 or 2
 * @returns {Promise<object>} Programming puzzle to solve to obtain L1/L2 secret
 */
function getBlacksmithPuzzle(level) {
    return request.get(`${endpointHost}/api/blacksmith/levels/${level}`)
        .then(function(response) {
            return response.body;
        })
        .catch(printError);
}

/**
 *
 * @param {number} level: 1 or 2
 * @param {string} answer to GET blacksmith API's puzzle
 * @returns {Promise<Object>} L1 secret for getCannonBall, or L2 secret for getDragonBall
 */
function postBlacksmithAnswer(level, answer) {
    return request.post(`${endpointHost}/api/blacksmith/levels/${level}`)
        .send({
            answer: answer
        })
        .then(function(response) {
            return response.body;
        })
        .catch(printError);
}
