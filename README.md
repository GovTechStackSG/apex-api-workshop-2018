# APEX API Challenge - Defence of the APIs
![APEX Logo](https://github.com/GovTechStackSg/apex-api-workshop-2018/blob/master/assets/color_apex_landscape.png)
## May 2018 GDS AI Conference - APEX Hands-on Workshop

 * [Overview](#overview)
 * [Agenda](#agenda)
 * [Prerequisites](#prerequisites)
 * [Preparation](#preparation)
 * [Gameplay](#api-challenge)

**NOTE: Watch this space!** This repo will be updated occasionally in the run-up to the actual workshop. Feel free to visit this about once a week to see what's new as a way to help you prepare for the session.

## Overview

This is a hands-on session where participants will design and secure their APIs. You will also get to play a game where you will be able to apply what you have learned from our workshop.

## Agenda

| No | Sessions |
| --- | --- |
| 1 | Introduction to CM |
| 2 | Consuming your first API |
| 3 | Quick Break |
| 4 | API Challenge |

## Prerequisites

- Some programming knowledge, preferably in Javascript. Example files in Javascript (for Node.js) will be provided for the workshop.
- Working laptop with Wifi capability.
- Your curiousity!

## Preparation

### Participant's machine set-up 

Please set up your machine before the session with the followings :

- Google Chrome (highly recommended)
- [Node.js version, 8.x.x LTS recommended](https://nodejs.org/en/download/)
- Text Editors
    - [Microsoft VS Code](https://code.visualstudio.com/download) (Recommended)
    - Notepad++/Sublime Text
    - Vim/Nano
- API Test Client (Optional) 
    - [Postman Chrome Plugin](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en) or [Postman Desktop App](https://www.getpostman.com/) (Recommended)
    - Restlet
- [Git](https://git-scm.com/downloads)

### Using the examples

**You will need the [Node.js runtime](https://nodejs.org/en/) installed to run the examples in this repository**

Clone this repository to your machine. You can study the code in the examples folder to see how this is done for secured endpoints.

You will be given the actual gateway-secured APIs during the workshop to call.

```bash
$ cd /your/local/workspace

$ git clone https://github.com/GovTechStackSG/apex-api-workshop-2018.git

$ cd /your/local/workspace/apex-api-workshop-2018/examples

$ node getTeamStatus.js

$ node getProtectedWeapon.js
```

`getTeamStatus.js` shows how to access the API challenge's team status API.

`getProtectedWeapon.js` shows how to use the APEX security utilities to access protected weapon APIs.

## API Challenge

### Objectives
- To help participants familiarise APEX portal through an interactive team-based API game
- Participants will know how to invoke an L0/L1/L2 secured API 
- Participants will know how to create an App in APEX

### Game Rules (Protect your fortress)
Each team will consist of 10 members. The purpose of the game is to have the highest H/P when the game ends. Game ends when the time is up!

Team will need to gather weapons and attack other team's fortress.

### Instructions

### APIs List (Take Note!)

### Important links

- Interactive Apex signature token validator: https://github.com/GovTechSG/apex-signature-validator

- Node.js Library for signing API requests: https://github.com/GovTechSG/node-apex-api-security
