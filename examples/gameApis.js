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

// Exported functions
module.exports = {
    getAllTeamsStatuses,
    getTeamStatus,
    getSnowBall,
    getCannonBall,
    getDragonBall,
    getBlacksmithPuzzle,
    postBlacksmithAnswer,
    attackTeam
};

// API call functions. 
// These functions make use of Javascript promises (https://developers.google.com/web/fundamentals/primers/promises)
/**
 * Fetch information on all teams
 *
 * @returns {Promise<array>} An array of objects containing team information
 */
function getAllTeamsStatuses() {
    return request.get('https://training.api.gdshive.com/apex-dota/api/teams/status')
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
    return request.get('https://training.api.gdshive.com/apex-dota/api/teams/' + teamName + '/status')
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
    return request.put('https://training.api.gdshive.com/apex-dota/api/weapons/snowball')
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
 * @param {string} authToken L1 signature token generated containing apex signature. See https://github.com/GovTechSG/node-apex-api-security.
 * @returns {Promise} Updated team information
 */
function getCannonBall(teamName, authToken) {
    return request.put('https://training.api.gdshive.com/apex-dota/api/weapons/cannonball')
        .set('authorization', authToken) // Set authorization header to token
        .send({
            teamName: teamName
        })
        .then(function(response) {
            return response.body
        })
        .catch(printError);
}

/**
 * Fetches some dragon balls for a team
 *
 * @param teamName
 * @param {string} authToken L2 signature token generated containing apex signature. See https://github.com/GovTechSG/node-apex-api-security.
 * @returns {Promise<object>} Updated team information
 */
function getDragonBall(teamName, authToken) {
    return request.put('https://training.api.gdshive.com/apex-dota/api/weapons/dragonball')
        .set('authorization', authToken) // Set authorization header to token
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
    return request.get('https://training.api.gdshive.com/apex-dota/api/blacksmith/levels/' + level)
        .then(function(response) {
            return response.body;
        })
        .catch(printError);
}

/**
 * Submit answer to blacksmith challenge to obtain L1 or L2 weapon secrets
 * 
 * @param {number} level: 1 or 2
 * @param {string} answer to GET blacksmith API's puzzle
 * @returns {Promise<Object>} L1 secret for getCannonBall, or L2 secret for getDragonBall
 */
function postBlacksmithAnswer(level, answer) {
    return request.post('https://training.api.gdshive.com/apex-dota/api/blacksmith/levels/' + level)
        .send({
            answer: answer
        })
        .then(function(response) {
            return response.body;
        })
        .catch(printError);
}

/**
 *  Attack another team to bring down their health
 *
 *  @param {string} attacker Name of attacking team
 *  @param {string} defender Name of defending team
 *  @param {string} weaponName Name of weapon used to attack
 *  @param {string} attackPassword Password for attacker, to make sure that the attacking team
 *  @param {string} authToken L1 signature token generated containing apex signature. See https://github.com/GovTechSG/node-apex-api-security.
 */
function attackTeam(attacker, defender, weaponName, attackPassword, authToken) {
    return request.post('https://training.api.gdshive.com/apex-dota/api/attack')
        .set('authorization', authToken) // Set authorization header to token
        .send({
            attacker: attacker,
            defender: defender,
            weaponName: weaponName,
            attackPassword: attackPassword
        })
        .then(function(response) {
            return response.body
        })
        .catch(printError);
}

// If a call fails, it will be printed to the console
function printError(error) {
    console.log(error.response ? error.response.error : error);
}
