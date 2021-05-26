/**
 * Name: Logan Apple
 * CS 101 Spring 2021
 * Date: May 26th, 2021
 * 
 * This is the app for running the main part of the site! It contains
 * endpoints for the cart, store, and user information. It also runs
 * the content, providing a webserver for static client-facing content.
 */
"use strict";

/*************************************************************
 * IMPORTS
 *************************************************************/

import express from "express";

/*************************************************************
 * CONSTANTS
 *************************************************************/

const app = express();
const PORT = process.env.PORT || 8000;

/*************************************************************
 * ENDPOINTS
 *************************************************************/



/*************************************************************
 * APP SETUP
 *************************************************************/

app.use(express.static('public'))
app.listen(PORT);
