/* global $, render, api refreshApp */
'use strict';
/**
 * EVENT HANDLERS (callback methods for jQuery events listeners)
 * 
 * Primary Job:
 * - Prevent default actions on HTML elements
 * - Validate input
 * - Updates STATE/STORE
 * - Call API methods
 * - Call render methods
 * 
 * 
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - Never make fetch/AJAX calls directly
 * - Updates to STATE/STORE allowed
 * 
 */

var handle = {
  tempLogin: function(event) {
    const state = event.data;
    state.view = 'login';
    render.page(state);
  },

  tempSignup: function(event) {
    const state = event.data;
    state.view = 'signup';
    render.page(state);
  },

  publicCancel: function(event) {
    const state = event.data;
    state.view = 'public';
    render.page(state);
  },

  submitVotes: function(event) {
    const state = event.data;
    state.view = 'public';
    countVotes(state);
    render.page(state);
  },

  electionAdmin: function(event) {
    const state = event.data;
    console.log(event.target.id);
    if(event.target.id === 'go-new-race-btn'){
      state.visibleCandidates = 1;
      state.view = 'race-edit';
    }
    else if(event.target.id === 'cancel-election-admin-btn'){
      state.view = 'public';
    }
    else if(event.target.id.charAt(0) === 'd'){
      handle.raceDelete(event.target.id, state);
    }
    
    render.page(state);

  },

  newCandidate: function(event) {
    const state = event.data;
    if(state.visibleCandidates < 9) {
      state.visibleCandidates += 1;
      render.candidateAdd(state);
    } 
  },

  postNewRace: function(event) {
    const state = event.data;
    state.newItem.type = $('#race-type').val();
    state.newItem.city = $('#city').val();
    state.newItem.state = $('#state').val();
    state.newItem.district = $('#district').val();
    state.newItem.candidates = [];
    for(let i = 1; i <= state.visibleCandidates; i++) {
      if($('#candidate-' + i)) {
        state.newItem.candidates.push(
          {candidate: {
            name: $('#candidate-' + i).val(),
            votes: 0}
          }
        );
      }
    }

    render.clearRaceEdit(state);
    api.create(state.newItem, state.token)
      .then(response => {
        state.view = 'election-admin';
        state.item = response;
        state.newItem = null;
        refreshApp();
        render.page(state);
      })
      .catch(err => {
        if (err.code === 401) {
          state.backTo = state.view;
          state.view = 'signup';
        }
        console.error(err);
      });
  },

  raceDelete: function(id, state) {
    id = id.slice(2);
    return api.remove(id, state.token)
      .then(() => {
        refreshApp();
      })
      .catch(err => {
        if (err.code === 401) {
          state.backTo = state.view;
          state.view = 'signup';
          render.page(state);
        }
        console.error(err);
      });
  },

  cancelNewRace: function(event) {
    const state = event.data;
    state.view = 'election-admin';
    render.page(state);
  },

  signup: function(event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();
    const city = el.find('[name=city]').val().trim();
    const userState = el.find('[name=state]').val().trim();
    const district = el.find('[name=district]').val().trim();
    const adminUser = $('#signup-admin').is(':checked');
    const hasVoted = false;
    el.trigger('reset');
    api.signup(username, password, city, userState, district, adminUser)
      .then(() => {
        state.view = 'login';
        render.page(state);
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          console.error(err.reason, err.message);
        } else {
          console.error(err);
        }
      });
  },

  login: function (event) {
    event.preventDefault();
    const state = event.data;
    const el = $(event.target);
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();

    api.login(username, password)
      .then(response => {
        state.token = response.authToken;
        localStorage.setItem('authToken', state.token);
        function parseJwt (token) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse(window.atob(base64));}
        parseJwt(response.authToken).user.adminUser ? state.view = 'election-admin' : state.view = 'voting';
        refreshApp();
        render.page(state);
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          console.error(err.reason, err.message);
        } else {
          console.error(err);
        }
      });
  },

  viewLogin: function (event) {
    event.preventDefault();
    const state = event.data;
    state.view = 'login';
    render.page(state);
  },
  viewSignup: function (event) {
    event.preventDefault();
    const state = event.data;
    state.view = 'signup';
    render.page(state);
  },

};

function countVotes(state) {
  let candidateSelected;
  let candidateObj;
  Object.keys(state.races).forEach(raceKey => {
    candidateSelected = $(`input[name=${raceKey}]:checked`).val();
    state.races[raceKey].candidates.filter(obj => obj.name === candidateSelected)[0].votes+=1;
  });
}



// search: function (event) {
//   event.preventDefault();
//   const state = event.data;
//   const el = $(event.target);
//   const query = {
//     name: el.find('[name=name]').val()
//   };

//   api.search(query)
//     .then(response => {
//       state.list = response;
//       render.results(state);

//       state.view = 'search';
//       render.page(state);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// },

// create: function (event) {
//   event.preventDefault();
//   const state = event.data;
//   const el = $(event.target);

//   const document = {
//     name: el.find('[name=name]').val()
//   };
//   api.create(document, state.token)
//     .then(response => {
//       state.item = response;
//       state.list = null; //invalidate cached list results
//       render.detail(state);
//       state.view = 'detail';
//       render.page(state);
//     })
//     .catch(err => {
//       if (err.code === 401) {
//         state.backTo = state.view;
//         state.view = 'signup';
//         render.page(state);
//       }
//       console.error(err);
//     });
// },

// update: function (event) {
//   event.preventDefault();
//   const state = event.data;
//   const el = $(event.target);

//   const document = {
//     id: state.item.id,
//     name: el.find('[name=name]').val()
//   };
//   api.update(document, state.token)
//     .then(response => {
//       state.item = response;
//       state.list = null; //invalidate cached list results
//       render.detail(state);
//       state.view = 'detail';
//       render.page(state);
//     })
//     .catch(err => {
//       if (err.code === 401) {
//         state.backTo = state.view;
//         state.view = 'signup';
//         render.page(state);
//       }
//       console.error(err);
//     });
// },

// details: function (event) {
//   event.preventDefault();
//   const state = event.data;
//   const el = $(event.target);

//   const id = el.closest('li').attr('id');
//   api.details(id)
//     .then(response => {
//       state.item = response;
//       render.detail(state);
//       state.view = 'detail';
//       render.page(state);
//     })
//     .catch(err => {
//       state.error = err;
//       render.error(state);
//     });
// },

// remove: function (event) {
//   event.preventDefault();
//   const state = event.data;
//   const id = $(event.target).closest('li').attr('id');

//   api.remove(id, state.token)
//     .then(() => {
//       state.list = null; //invalidate cached list results
//       return handle.search(event);
//     })
//     .catch(err => {
//       if (err.code === 401) {
//         state.backTo = state.view;
//         state.view = 'signup';
//         render.page(state);
//       }
//       console.error(err);
//     });
// },
// viewCreate: function (event) {
//   event.preventDefault();
//   const state = event.data;
//   state.view = 'create';
//   render.page(state);
// },

// viewSearch: function (event) {
//   event.preventDefault();
//   const state = event.data;
//   if (!state.list) {
//     handle.search(event);
//     return;
//   }
//   state.view = 'search';
//   render.page(state);
// },
// viewEdit: function (event) {
//   event.preventDefault();
//   const state = event.data;
//   render.edit(state);

//   state.view = 'edit';
//   render.page(state);
// }