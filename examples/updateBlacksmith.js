const request = require('superagent');
const fs = require('fs');
const path = require('path');

const ca = fs.readFileSync(path.resolve(__dirname, 'keys-certs/root-ca.crt'));

function updateBlacksmith(level, data) {

    const endpoint = `https://example.api.dev/apex-dota/api/blacksmith/levels/${level}`;

    return request.post(endpoint, data)
        .ca(ca)
        .then(function (response) {
            console.log('Success!');
            console.log(response.body);
        })
        .catch(function (error) {
            console.log('Error!');
            console.log(error.response ? error.response.error : error);
        });
}

let data = {
    "teamName": "team1",
    "answer": "l1 answer"
};
updateBlacksmith(1, data);