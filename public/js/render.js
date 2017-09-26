/* global $ */
'use strict';
/**
 * RENDER METHODS
 * 
 * Primary Job: Direct DOM Manipulation
 * 
 * Rule of Thumb:
 * - Direct DOM manipulation OK
 * - Never update state/store
 * 
 */

var render = {
  page: function(state) {
    $('.view').hide();
    $('#' + state.view).show();
    const states = {
      public: () => render.electionResults(state),
      voting: () => render.electionBallot(state)
    };
    states[state.view]();
  },

  electionResults: function(state) {
    let racesHtml = '';
    Object.keys(state.races).forEach(raceKey => {
      racesHtml += 
        `<div class="race-block">
          <span class="race-label">${state.races[raceKey].desc}</span>`;
      state.races[raceKey].candidates.forEach(candidate => {
        racesHtml += 
          `<li>${candidate.name} - ${candidate.votes}</li>`;
      });
      racesHtml += '</div>';
    });
    $('#public-results').html(racesHtml);
  },

  electionBallot: function(state) {
    let racesHtml = '';
    Object.keys(state.races).forEach(raceKey => {
      racesHtml += 
        `<div class="race-block">
          <span class="race-label">${state.races[raceKey].desc}</span>
            <div>`;
      state.races[raceKey].candidates.forEach(candidate => {
        racesHtml += 
          `<label for="${candidate.name.replace(' ','-')}" class="radio-label">
            <input type="radio" id="${candidate.name.replace(' ','-')}" name="race"
              value="${candidate.name}" />${candidate.name}
          </label>`;
      });
      racesHtml += '</div></div>';
    });
    $('#ballot-list').html(racesHtml);
  },
 



};    // end of render()

















// results: function (state) {
//   const listItems = state.list.map((item) => {
//     return `<li id="${item.id}">
//               <a href="" class="detail">Name: ${item.name}</a>
//               <a href="#" class="remove">X</a>
//             </li>`;
//   });
//   $('#result').empty().append('<ul>').find('ul').append(listItems);
// },
// edit: function (state) {
//   const el = $('#edit');
//   const item = state.item;
//   el.find('[name=name]').val(item.name);
// },
// detail: function (state) {
//   const el = $('#detail');
//   const item = state.item;
//   el.find('.name').text(item.name);
// }