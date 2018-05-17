# APEX API Challenge
![APEX Logo](https://github.com/GovTechStackSg/apex-api-workshop-2018/blob/master/assets/color_apex_landscape.png)
## May 2018 GDS AI Conference - APEX Hands-on Workshop

 * [Overview](#overview)
 * [Agenda](#agenda)
 * [Prerequisites](#prerequisites)
 * [Preparation](#preparation)
 * [API Challenge](#api-challenge)

**NOTE: Watch this space!** This repo will be updated occasionally in the run-up to the actual workshop. Feel free to 
visit this about once a week to see what's new as a way to help you prepare for the session.

## Overview

This is a hands-on session where participants will design and secure their APIs. You will also get to play a game where 
you will be able to apply what you have learned from our sharing session.

## Agenda

| No | Sessions |
| --- | --- |
| 1 | Introduction to APEX|
| 2 | RESTful API Design and Best Practices |
| 3 | API Security |
| 4 | Quick Break (Optional) 10 Minutes|
| 5 | APEX Demo|
| 6 | Tea Break 20 Minutes|
| 7 | API Challenge|

## Prerequisites

- Some programming knowledge, preferably in Javascript. Example files in Javascript (for Node.js) will be provided for 
the workshop.
- Working laptop with Wifi capability.
- Your curiousity!

## Preparation

### Participant's machine set-up 

Please set up your machine before the session with the followings :

- Google Chrome (highly recommended)
- [Node.js version, 8.x.x LTS highly recommended](https://nodejs.org/en/download/)
- Text Editors
    - [Microsoft VS Code](https://code.visualstudio.com/download) (Recommended)
    - Notepad++/Sublime Text
    - Vim/Nano
- API Test Client (Optional) 
    - [Postman Chrome Plugin](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en) 
    or [Postman Desktop App](https://www.getpostman.com/) (Recommended)
    - Restlet
- [Git](https://git-scm.com/downloads)
## API Challenge
*Please make sure that you have the Node.js runtime installed on your laptop*

### Take aways
- Participants will learn how APIs are secured on Apex.
- Participants will learn how to invoke an unsecured/L1/L2 API. 

### Game rules
Teams will need to gather weapons and attack each other's fortresses making use of API calls. The status of each team 
will be projected for everyone to see.

Participants will be split into 10 teams. The goal of the game is to be the last team standing, or have the highest HP 
when time is up.  

### Instructions
 
Participants will need to make use of the game's APIs to obtain weapons and attack other teams with their weapons. There
are 3 types of weapons in this game: snow balls, cannon balls and dragon balls. Each weapon deals progressively higher 
damage and are harder to obtain. Each team would start with 10 snow balls.

There are 4 types of APIs used to interact with the game backend: status, weapon, blacksmith, attack.

In general, your objectives in this game would be to call the weapon APIs to obtain ammo, and call the attack API to 
attack other teams with the ammo you have accumulated. 

To make API calls, you can either use [Postman](https://www.getpostman.com) or the 
[superagent](https://github.com/visionmedia/superagent) in Node.js (recommended).

Note however, that the cannon ball and dragon ball weapon APIs
are secured with Apex L1 and L2 auth policies respectively. This means that you would need to use the blacksmith APIs to
obtain secrets, and use our [node-apex-api-security](https://github.com/GovTechSG/node-apex-api-security) npm package to
sign your API calls to obtain these two weapons.
Consequently, they are significantly more powerful than snow balls, whose API is unsecured.

An example of the code you will write to play this game is included below. It is written for Node.js, and includes code
that interacts with the game APIs by sending HTTP requests. It also demonstrates how to generate Apex signatures.
 
The full API documentation can be found at https://govtechstacksg.github.io/apex-api-workshop-2018.
The corresponding `swagger.yaml` (API definition) file can be found in the `docs` folder. 

**Summary**

1. To make API calls, use [Postman](https://www.getpostman.com) or 
[superagent](https://github.com/visionmedia/superagent) ([documentation](http://visionmedia.github.io/superagent/))
2. To generate Apex signatures, use our [node-apex-api-security npm package](https://github.com/GovTechSG/node-apex-api-security)

#### Getting started

We will use superagent to make HTTP calls and node-apex-api-security to sign our secured Apex API calls.
You can learn how to use them from their documentation:
1. [Superagent documentation](http://visionmedia.github.io/superagent/)
2. [Node-apex-api-security documentation](https://github.com/GovTechSG/node-apex-api-security)
 
Navigate to your desired directory and install them:

```bash
$ npm install node-apex-api-security # Required for generating Apex signature tokens
$ npm install superagent # Used by gameApis.js to make HTTP calls
```

Create a new .js file in your directory and run it with Node.js. For example:`$ node game.js`

```javascript
// game.js

// Import our dependencies
let ApiSigningUtil = require('node-apex-api-security');
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
    urlPath: 'https://apex.workshop.api.signing.host/api/attack', // The API gateway's API endpoint used for signing, to be given during the workshop, for signing.
    appId: 'my-attack-app-id',      // Apex app ID, set at Apex gateway
    secret: 'my-attack-app-secret', // Apex app secret, set at Apex gateway
    authPrefix: 'apex_l1_eg',       // Gateway auth prefix, follows format of apex_(l1 or l2)_(ig or eg) depending on l1 or l2 auth, and intranet (ig) or internet (eg) gateway 
    httpMethod: 'post'              // HTTP POST API
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

##### L1 and L2 weapons

To use cannon balls and dragon balls, teams would need to obtain them using the /weapons/cannonball and /weapons/dragonball APIs.
They are L1 and L2 secured, which means that an authToken would need to be generated to call them, similar to the attack API.

Example of obtaining an L1 signature token: https://github.com/GovTechSG/node-apex-api-security#l1-secured-api

Example of obtaining an L2 signature token: https://github.com/GovTechSG/node-apex-api-security#l2-secured-api

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