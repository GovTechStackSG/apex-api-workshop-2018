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

There are 4 types of APIs used to interact with the game backend: status, weapon, blacksmith, attack. API documentation 
and swagger file can be found under the `docs` folder. You can also view the documentation at 
[https://govtechstacksg.github.io/apex-api-workshop-2018]().

You would want to examine the Node.js examples found in `examples/gameApis.js`, which provide helper code in invoking the
APIs in our game. All of the functions can be used as-is, except for the `getCannonBall` and `getDragonBall` functions 
which require participants to obtain Apex L1 and L2 credentials before invoking. These credentials can be found be 
invoking the blacksmith APIs.

#### Using `gameApis.js`

Before running the code in `gameApis.js` you would need to install required dependencies:

```bash
$ npm install node-apex-api-security # Required for generating Apex signature tokens
$ npm install superagent # Used by gameApis.js to make HTTP calls
```

```javascript
let ApiSigningUtil = require('node-apex-api-security');
let gameApis = require('./gameApis');

// To find the status for team Alpha
gameApis.getTeamStatus('alpha')
    .then(console.log); // Prints response from the API call
    
// To obtain some snow balls for team Alpha
gameApis.getSnowBall('alpha')
    .then(console.log);

// To attack another team with snow balls
// We need to construct the signature token since this API is L1 secured.
const signingEndpoint = 'https://training.api.lab/apex-dota/api/attack'; // The API gateway's API endpoint, for signing. Note that this is different from the actual endpoint called!
const appId = 'apex-dota-l1-attack'; // Apex App ID, set at Apex gateway
const secret = 'eXnotJP2NWC4'; // Apex App secret, set at Apex gateway
const authPrefix = 'apex_l1_eg'; // Prefix, follows format of apex_(l1 or l2)_(ig or eg) depending on l1 or l2 auth, and intranet (ig) or internet (eg) gateway
const httpMethod = 'post'; // API uses HTTP POST

const reqOptions = {
 appId,
 authPrefix,
 httpMethod,
 secret,
 urlPath: signingEndpoint
};

const authToken = ApiSigningUtil.getSignatureToken(reqOptions);

// This calls the attack API
gameApis.attackTeam('alpha', 'beta', 'snowball', 'team-alpha-attack-password', authToken)
```
For more information on how to use ApiSigningUtil, check out [https://github.com/GovTechSG/node-apex-api-security]().

#### L1 and L2 weapons

To use cannon balls and dragon balls, teams would need to obtain them using the /weapons/cannonball and /weapons/dragonball APIs.
They are L1 and L2 secured, which means that an authToken would need to be generated to call them, similar to the attack API.
To obtain the Apex credentials for calling the get cannon ball and get dragon ball APIs, players will need to solve challenges
presented by the blacksmith APIs.

```javascript
// To obtain cannon balls
// 1. Get L1 weapon puzzle from the blacksmith APIs
gameApis.getBlacksmithPuzzle(1)
    .then(console.log);
    
// 2. After solving the puzzle, POST the answer back to the blacksmith API
gameApis.postBlacksmithAnswer(1, 'this-is-my-answer')
    .then(console.log); 
// If the answer is correct, this would print out the L1 secret needed for obtaining cannon balls.
// Use them for the appId and secret fields as seen for the attack API example above.
```


### Important links
- Node.js Library for signing API requests: https://github.com/GovTechSG/node-apex-api-security
- Interactive Apex signature token validator: https://github.com/GovTechSG/apex-signature-validator
