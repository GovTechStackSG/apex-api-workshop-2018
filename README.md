# APEX API Workshop
![APEX Logo](/assets/color_apex_landscape.png)
## STACK 2018 - APEX Hands-on Workshop

 * [Overview](#overview)
 * [Agenda](#agenda)
 * [Presentation](#presentation-slides)
 * [Prerequisites](#prerequisites)
 * [Preparation](#preparation)
 * [API Challenge](#api-challenge)

**NOTE: Watch this space!** This repo will be updated occasionally in the run-up to the actual workshop. Feel free to 
visit this about once a week to see what's new as a way to help you prepare for the session.

## Overview

This is a hands-on session where participants will learn how to design and secure their APIs. There will also be an API challenge where participants can apply what they have learned to generate API signatures to authenticate with Apex APIs.

## Presentation Slides

Slides from the HUONE session are available here :

* [REST API Design Good Practices](/docs/01_REST_API_Designs.pdf)
* [REST API Security](docs/02_REST_API_Security.pdf)

Slides from the STACK 2018 session are available here: https://goo.gl/k4C4YN

## Prerequisites

- Some programming knowledge, preferably in Javascript. Example files in Javascript (for Node.js) will be provided for 
the workshop.
- Working laptop with Wifi capability.

### Software

Please make sure you have the following installed on your laptops:
- Google Chrome
- [Node.js >8](https://nodejs.org/en/download/)
- A text editor, such as Sublime, Notepad++, [Microsoft VS Code](https://code.visualstudio.com/download) etc
- HTTP API Development Client (Optional) 
    - [Postman](https://www.getpostman.com/)
- [Git](https://git-scm.com/downloads)

## API Challenge
*Please make sure that you have the Node.js runtime installed on your laptop*

### API Documentation
API challenge documentation can be found at https://documenter.getpostman.com/view/2049715/RWgjYgtK. You can find API URLs and example headers and request bodies, if applicable.

### Take aways
- Participants will learn how APIs are secured on Apex.
- Participants will learn how to invoke an unsecured/L1/L2 API. 

### Game rules
Teams will need to gather weapons and attack each other's fortresses making use of API calls. The status of each team 
will be projected for everyone to see.

Participants will be split into 10 teams. The goal of the game is to be the last team standing, or have the highest HP 
when time is up.  

### Instructions
Participants will need to make use of the game's APIs to obtain weapons and attack other teams with their weapons. 

To make API calls, you can write Node.js scripts using the [superagent](https://github.com/visionmedia/superagent) HTTP request library. Alternative, a GUI solution is available: [Postman](https://www.getpostman.com).

The APIs to obtain more powerful weapons are secured behind Apex L1 and L2 security policies. Use our [node-apex-api-security](https://github.com/GovTechSG/node-apex-api-security) npm package or [Apex signature validator](https://github.com/GovTechSG/apex-signature-validator) to
obtain Apex signatures for your API calls to obtain these two weapons.
Consequently, they are significantly more powerful than snow balls, whose API is unsecured.

An example of the code you will write to play this game is included below. It is written for Node.js, and includes code
that interacts with the game APIs by sending HTTP requests. It also demonstrates how to generate Apex signatures.

#### Summary
1. Go through the API documentation to find out the parameters needed in your API calls

2. Make PUT /weapons API calls to obtain weapons and make POST /attack API calls to bring down other teams

3. To make L1/L2 authenticated API calls using Postman:

    Obtain an Apex authorization token containing your Apex signature with [Apex signature validator](https://github.com/GovTechSG/apex-signature-validator), then set the 'Authorization' header in your Postman request to the generated token.

4. To make L1/L2 authenticated API calls using node.js:

    Use our [node-apex-api-security](https://github.com/GovTechSG/node-apex-api-security) npm package to obtain an Apex authorization token and use the [superagent](https://github.com/visionmedia/superagent) HTTP library to make your API calls with the 'Authorization' header set to the generated token. You can also use other HTTP request libraries if you wish.

#### List of secured APIs

![List of secured APIs](/assets/secured_apis.png)

#### Interacting with APIs through Node.js

In the examples below we will use `superagent` to make HTTP calls and `node-apex-api-security` to sign our secured Apex API calls.
You can learn how to use them from their documentation:
* [Superagent documentation](http://visionmedia.github.io/superagent/)
* [node-apex-api-security documentation](https://github.com/GovTechSG/node-apex-api-security)

Navigate to your desired directory and install them through npm:

```bash
$ npm install node-apex-api-security # Required for generating Apex signature tokens
$ npm install superagent # Used by gameApis.js to make HTTP calls
```

Create a new .js file in your directory and run it with Node.js. For example: `$ node game.js`

```javascript
// game.js

// Import our dependencies
let ApiSigningUtil = require('node-apex-api-security').ApiSigningUtil; //Import the class from the library
let request = require('superagent'); // Our HTTP request library. See https://visionmedia.github.io/superagent/

// Let's make a HTTP call to find the status for our team
request.get('https://apex.workshop.api.challenge.host/api/teams/my-team-name/status') // The host will be given during the workshop
    .then(function(response) {      // This callback function runs when the request is complete
        console.log(response.body); // This prints the team's information 
    });

// Let's make a HTTP call to get more snowballs for our team
request.put('https://apex.workshop.api.challenge.host/api/weapons/snowball') // This is a PUT API
    .send({
        teamName: 'my-team-name'
    })
    .then(function(response) {
        console.log(response.body); // If call is successful, prints updated ammo count for your team.
    });

// Let's make a HTTP call to the attack API to hit another team with snow balls
// We need to construct the signature token since this API is L1 secured.
// Actual values will be given on the day of the workshop
const authToken = ApiSigningUtil.getSignatureToken({
    urlPath: 'https://apex.workshop.api.signing.host/api/attack', // API Signing Endpoint. Note: differs from actual endpoint.
    appId: 'my-attack-app-id',      // Apex app ID, set at Apex gateway
    secret: 'my-attack-app-secret', // Apex app secret, set at Apex gateway
    authPrefix: 'apex_l1_eg',       // Gateway auth prefix, follows format of apex_(l1 or l2)_(ig or eg) depending on l1 or l2 auth, and intranet (ig) or internet (eg) gateway 
    httpMethod: 'post'              // HTTP method used for endpoint; /attack is POST
});

// Now make the API call
request.post('https://apex.workshop.api.challenge.host/api/attack') // Actual API endpoint
    .set('authorization', authToken) // Set Authorization header in request to Apex auth token
    .send({
        attacker: 'my-team-name',    // Your team's name
        defender: 'your-team-name',  // Name of team you are trying to attack
        weaponName: 'snowball',      // Weapon you want to use, in this case snowball. 
        attackPassword: 'password'   // Attacker's password, unique to each team. Prevents attacks made for you by other teams
    })
    .then(function(response) {
        console.log(response.body);  // If call is successful, prints the results of the attack
    })
```

#### API endpoints vs signing endpoints

The actual endpoint for an API differs from the one used for generating Apex signatures. Both will be given to you during the workshop. 

#### L1 and L2 weapons

To use cannon balls and dragon balls, teams would need to obtain them using the /weapons/cannonball and /weapons/dragonball APIs.
They are L1 and L2 secured, which means that an authToken would need to be generated to call them, similar to the attack API.

Example of obtaining an L1 authorization token: https://github.com/GovTechSG/node-apex-api-security#apex-l1-secured-api

Example of obtaining an L2 authorization token: https://github.com/GovTechSG/node-apex-api-security#apex-l2-secured-api

To obtain the Apex credentials for calling the get cannon ball and get dragon ball APIs, players will need to solve challenges
presented by the blacksmith APIs.

```javascript
// To obtain cannon balls
// 1. Get L1 weapon challenge from the blacksmith APIs
request.get('https://apex.workshop.api.challenge.host/api/blacksmith/levels/1')
    .then(function(response) {
        console.log(response.body); // Prints out the question
    });

// 2. After obtaining the answer, POST the answer back to the blacksmith API
let appId = '';
let secret = '';
request.post('https://apex.workshop.api.challenge.host/api/blacksmith/levels/1')
    .send({
        answer: 'my-answer'
    })
    .then(function(response) {
        console.log(response.body); // If the answer is correct, this would print out the L1 secret needed for obtaining cannon balls.
        // L1 secrets returned if API call succeeds. The appId and secret values can then be used similarly to attack API example above.
        appId = response.body.appId;
        secret = response.body.secret; 
    });

// 3. You can then use node-apex-api-security to construct Apex signatures and get cannon balls or dragon balls
let authToken = ApiSigningUtil.getSignatureToken({
    urlPath: 'https://apex.workshop.api.signing.host/api/weapons/cannonball',
    appId: appId,   // Obtained from blacksmith POST API
    secret: secret, // Obtained from blacksmith POST API
    authPrefix: 'apex_l1_eg',
    httpMethod: 'put'
    // To call /weapons/dragonball L2 API, use the keyString parameter instead of secret:
    // keyString: '-----BEGIN PRIVATE KEY-----\n...'
});

// API to obtain cannon balls
request.put('https://apex.workshop.com.api.challenge.host/api/weapons/cannonball')
    .set('authorization', authToken)
    .send({
        teamName: 'my-team-name'
    })
    .then(function(response) {
        console.log(response.body) // If call is successful, prints updated ammo count for your team.
    });
```

### Important links
- Interactive Apex signature token validator: https://github.com/GovTechSG/apex-signature-validator
This is an interactive HTML app that lets you fill in each parameter individually and generates an Apex signature which 
you can use to call L1/L2 authenticated endpoints.
