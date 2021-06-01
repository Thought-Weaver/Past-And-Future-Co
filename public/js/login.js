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

import {
    closeModal,
    fromId,
    fromName,
    checkStatus,
    handleError
} from "./utils.js";
 
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

    // Though elegant, I can see a world where somehow this will be
    // exploited without a check.
    if (this.submitted != "login" && this.submitted != "signup") {
        return;
    }

    // This will either be "login" or "signup" depending on which
    // button was pressed.
    fetch(`/${this.submitted}`, {
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
 
/************************************************************************
 * EVENT LISTENERS
 ***********************************************************************/
 
fromId("login-form").addEventListener("submit", submitForm);
fromId("login-btn").addEventListener("click", () => { fromId("login-form").submitted="login" });
fromId("signup-btn").addEventListener("click", () => { fromId("login-form").submitted="signup" });
fromId("close-response-btn").addEventListener("click", () => { closeModal("response-container") });