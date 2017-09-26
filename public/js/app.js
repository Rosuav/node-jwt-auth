/* global jQuery, handle render dummyData */
'use strict';
/**
 * EVENT LISTENERS
 * 
 * Primary Job:
 * - Listen for user events like `click`, and call event handler methods
 * - Pass the "STORE" and the event objects and the event handlers
 * 
 * Setup:
 * jQuery's document ready "starts" the app
 * Event listeners are wrapped in jQuery's document.ready function
 * STORE is inside document.ready so it is protected
 * 
 * 
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - Never make fetch/AJAX calls directly
 * - Updates to STATE/STORE allowed
 * 
 */

// Make STORE global so it can be easily qu
var STORE;
//on document ready bind events
jQuery(function ($) {

  STORE = {
    view: 'public', // signup | login | public | voting | election-admin | race-edit 
    backTo: null,
    query: {},      // search query values
    list: null,     // search result - array of objects (documents)
    item: null,     // currently selected document
    token: localStorage.getItem('authToken'), // jwt token
    adminUser: true    // admin user doesn't votes, admins races
  };

  // Setup all the event listeners, passing STATE and event to handlers
  $('#public-login-btn').on('click', STORE, handle.tempLogin);
  $('#public-signup-btn').on('click', STORE, handle.tempSignup);
  $('.public-cancel').on('click', STORE, handle.publicCancel);
  $('#submit-votes-btn').on('click', STORE, handle.submitVotes);
  $('#election-admin').on('click', 'button', STORE, handle.electionAdmin);
  $('#add-edit-race-frm').on('click', 'button', STORE, handle.addEditRace);  
  $('#new-race-post-btn').on('click', STORE, handle.postNewRace);  
  $('#new-race-cancel-btn').on('click', STORE, handle.cancelNewRace);  
  
  $('#signup').on('submit', STORE, handle.signup);
  $('#login').on('submit', STORE, handle.login);

  $('#signup').on('click', '.viewLogin', STORE, handle.viewLogin);
  $('#login').on('click', '.viewSignup', STORE, handle.viewSignup);  

  initializeApp();

});

function initializeApp() {
  return api.search()
    .then(response => STORE.races = response)
    .then(
  // STORE.races = dummyData;
  // console.log(STORE.races);
  render.page(STORE));
}


// $('#create').on('submit', STORE, handle.create);
// $('#search').on('submit', STORE, handle.search);
// $('#edit').on('submit', STORE, handle.update);

// $('#result').on('click', '.detail', STORE, handle.details);
// $('#result').on('click', '.remove', STORE, handle.remove);

// $('#search').on('click', '.viewCreate', STORE, handle.viewCreate);
// $('#detail').on('click', '.viewSearch', STORE, handle.viewSearch);
// $('#detail').on('click', '.edit', STORE, handle.viewEdit);

// // start app by triggering a search
// $('#search').trigger('submit');