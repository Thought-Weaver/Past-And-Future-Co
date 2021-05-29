/*
  Name: Logan Apple
  CS 101 Spring 2021
  Date: May 26th, 2021

  The JS for the L&A Past and Future Co. website. This is the contact
  form script. Historically, this would be handled with PHP, but here
  we're going to explore how it can be done with Node instead! This
  just handles listening to the form and passing the request to the
  back-end for processing.
 */

/************************************************************************
 * IMPORTS
 ***********************************************************************/

import { openModal, fromId, fromName } from "./utils.js"

/************************************************************************
 * FUNCTIONS
 ***********************************************************************/

/**
 * Submit the form with a POST request and prevent it from navigating
 * away from the page.
 *
 * @param {Event} event - The event caused by the form submission.
 */
function submitForm(event) {
    // Stop navigation away from the page.
    event.preventDefault();

    fetch("/contact-form", {
        method: "POST",
        body: JSON.stringify({
            name: fromName("name")[0].value,
            email: fromName("email")[0].value,
            message: fromName("message")[0].value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(checkStatus)
    .then(response => response.text())
    .then(createFormResponse)
    .catch(handleError);
}

function createFormResponse(text) {
    fromId("server-response").getElementsByTagName("h1")[0].textContent = "Success!";
    fromId("server-response").getElementsByTagName("p")[0].textContent = text;

    openModal("response-container");
}

/**
 * Checks the status of the response for an error. In the case of an error,
 * throws an error to interrupt the fetch sequence.
 *
 * @param {Response} response - The response from the API call.
 * @return {object} If successful, a parsed object from the response JSON.
 */
function checkStatus(response) {
    if (!response.ok) {
        throw new Error("Response fetch failed with status " + response.status + "!");
    }
    return response;
}

/**
 * Handles any errors that occur in the fetch sequence.
 *
 * @param {Error} error
 */
function handleError(error) {
    fromId("server-response").getElementsByTagName("h1")[0].textContent = "Error!";
    fromId("server-response").getElementsByTagName("p")[0].textContent = "There's been an error: " + error;

    openModal("response-container");
}

/************************************************************************
 * EVENT LISTENERS
 ***********************************************************************/

fromId("contact-form").addEventListener("submit", submitForm);