const request = require('superagent');
const fs = require('fs');
const path = require('path');

const ca = fs.readFileSync(path.resolve(__dirname, 'keys-certs/root-ca.crt'), 'utf-8');

return request.get('https://example.api.dev/apex-dota/api/teams/status')
    .ca(ca)
    .then(response => {
        console.log(response.body);
    })
    .catch(error => {
        console.log(error.response ? error.response.error : error);
    });