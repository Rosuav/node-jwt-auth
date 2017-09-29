/* global jQuery, handle render dummyData api*/
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
    visibleCandidates: 0,   // candidates displayed on add/edit race page
    editingRaceId: null,     // current race being edited
    list: null,     // search result - array of objects (documents)
    item: null,     // currently selected document
    token: localStorage.getItem('authToken'), // jwt token
    races: []
    // states: [
    //   {name: 'VA', districts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
    //   {name: 'FL', districts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]}
    // ]
  };

  // Setup all the event listeners, passing STATE and event to handlers
  $('#public-login-btn').on('click', STORE, handle.tempLogin);
  $('#public-signup-btn').on('click', STORE, handle.tempSignup);
  $('.public-cancel').on('click', STORE, handle.publicCancel);
  $('#submit-votes-btn').on('click', STORE, handle.submitVotes);
  $('#election-admin').on('click', 'button', STORE, handle.electionAdmin);
  $('#new-race-post-btn').on('click', STORE, handle.editRacePost);  
  $('#new-race-cancel-btn').on('click', STORE, handle.cancelNewRace);  
  $('#add-candidate-btn').on('click', STORE, handle.newCandidate);

  $('#signup').on('submit', STORE, handle.signup);
  $('#login').on('submit', STORE, handle.login);

  $('#signup').on('click', '.viewLogin', STORE, handle.viewLogin);
  $('#login').on('click', '.viewSignup', STORE, handle.viewSignup);  

  refreshApp();
  
});

function refreshApp() {
  console.log('refresh running');
  return api.search()
    .then(response => {
      STORE.races = response;
    })
    .then( () => {
      render.page(STORE);
    });
}

// 
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