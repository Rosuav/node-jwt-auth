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


function fname() {}

const myExpF = fname;



var render = {
  page: function(state) {
    $('.view').hide();

    // call fs for specific rendering
    const states = {
      public: render.electionResults,
      voting: render.electionBallot,
      'election-admin': render.raceAdminList
    };

    if(state.view in states) {
      states[state.view](state);
    }

    // show current panel
    $('#' + state.view).show();

  },

  electionResults: function(state) {
    let racesHtml = '';
    let raceLabel = '';
    state.races.forEach(race => {
      race.city!=='n/a' ? raceLabel = `${race.city}, ${race.state}` : raceLabel = race.state;
      race.district!=='n/a' ? raceLabel += ` - dist ${race.district} ${race.type}` : raceLabel +=` ${race.type}`;
      racesHtml += `
        <div class="race-block">
          <span class="race-label">${raceLabel}</span>`;
      race.candidates.forEach(candidate => {
        racesHtml += `
          <li>${candidate.candidate.name} - ${candidate.candidate.votes}</li>`;
      });
      racesHtml += '</div>';
    });
    $('#public-results').html(racesHtml);
  },

  electionBallot: function(state) {
    let racesHtml = '';
    let raceLabel = '';
    state.races.forEach(race => {
      race.city!=='n/a' ? raceLabel = `${race.city}, ${race.state}` : raceLabel = race.state;
      race.district!=='n/a' ? raceLabel += ` - dist ${race.district} ${race.type}` : raceLabel +=` ${race.type}`;
      racesHtml += `
        <div class="race-block">
          <span class="race-label">${raceLabel}</span>
            <div>`;
      race.candidates.forEach(candidate => {
        racesHtml += ` 
          <label for="${candidate.candidate.name.replace(' ','-')}" class="radio-label">
            <input type="radio" id="${candidate.candidate.name.replace(' ','-')}" name="${race.id}"
              value="${candidate.candidate.name}" />${candidate.candidate.name}
          </label>`;
      });
      racesHtml += '</div></div>';
    });
    $('#ballot-list').html(racesHtml);
  },

  raceAdminList: function(state) {
    let racesHtml = '';
    Object.keys(state.races).forEach(raceKey => {
      racesHtml += `
        <div class="admin-race-block">
          <span class="race-label">${state.races[raceKey].desc}</span>`;
      state.races[raceKey].candidates.forEach(candidate => {
        racesHtml += `
          <li>${candidate.name}</li>`;
      });
      racesHtml += `
          <button type="button" id="e-${raceKey}" class="small-button">Edit</button>
          <button type="button" id="d-${raceKey}" class="small-button">Delete</button>
        </div>`;
    });
    $('#election-admin-list').html(racesHtml);
  }



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