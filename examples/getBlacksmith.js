const request = require('superagent');
const fs = require('fs');
const path = require('path');

const ca = fs.readFileSync(path.resolve(__dirname, 'keys-certs/root-ca.crt'));

function getBlacksmith(level, teamName) {

    const endpoint = `https://example.api.dev/apex-dota/api/blacksmith/levels/${level}?teamName=${teamName}`;

    return request.get(endpoint)
        .ca(ca)
        .then(function(response) {
            console.log('Success!');
            console.log(response.body);
        })
        .catch(function(error) {
            console.log('Error!');
            console.log(error.response ? error.response.error : error);
        });
}

getBlacksmith(1, 'team1');