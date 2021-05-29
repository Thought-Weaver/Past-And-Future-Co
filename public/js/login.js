/*
  Name: Logan Apple
  CS 101 Spring 2021
  Date: May 28th, 2021

  The JS for the L&A Past and Future Co. login page. It handles sending
  the form information to the server and displaying a response.
 */

/************************************************************************
 * IMPORTS
 ***********************************************************************/

import { openModal, closeModal, fromId, fromName } from "./utils.js"
 
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
    // Stop navigation away from the page, will manually navigate if
    // successful.
    event.preventDefault();

    fetch("/login", {
        method: "POST",
        redirect: "follow",
        body: JSON.stringify({
            username: fromName("username")[0].value,
            password: fromName("password")[0].value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(checkStatus)
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
    .catch(handleError);
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
    fromId("server-response").getElementsByTagName("p")[0].textContent = error;

    openModal("response-container");
}
 
/************************************************************************
 * EVENT LISTENERS
 ***********************************************************************/
 
fromId("login-form").addEventListener("submit", submitForm);
fromId("close-response-btn").addEventListener("click", () => { closeModal("response-container") });