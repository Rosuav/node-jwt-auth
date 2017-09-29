'use strict';
/**
 * API: DATA ACCESS LAYER (using fetch())
 * 
 * Primary Job: communicates with API endpoints. 
 *  
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - No jquery on this page, use `fetch()` not `$.AJAX()` or `$.getJSON()`
 * - Do not call render methods from this layer
 * 
 */

const RACES_URL = '/api/races/';
const VOTE_URL = '/api/races/votes/';
const LOCAL_URL = '/api/races/local/';
const USERS_URL = '/api/users/';
const VOTED_URL = '/api/users/setVote/';
const LOGIN_URL = '/api/auth/login/';

var api = {
  
  signup: function (username, password, city, userState, district, adminUser) {
    const url = buildUrl(USERS_URL);
    const body = {
      username: username,
      password: password,
      city: city,
      state: userState,
      district: district,
      adminUser: adminUser
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },
  
  login: function (username, password) {
    const url = buildUrl(LOGIN_URL);
    const base64Encoded = window.btoa(`${username}:${password}`);

    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Encoded}`,
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },
  
  searchLoc: function (state) {
    let query = {};
    query['state'] = state.userInfo.state;
    query.city = state.userInfo.city;
    query.district=state.userInfo.district;
    const url = buildUrl(LOCAL_URL, query);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
    })
      .then(normalizeResponseErrors)
      .then(res => res.json());
  },

  search: function (query) {
    const url = buildUrl(RACES_URL, query);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },
  
  details: function (id) {
    const url = buildUrl(`${RACES_URL}${id}`);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },
  
  create: function (document, token) {
    const url = buildUrl(`${RACES_URL}`);
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: document ? JSON.stringify(document) : null
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },  
  
  update: function (document, token) {
    console.log('update running');
    const url = buildUrl(`${RACES_URL}${document.id}`);
    // console.log('url: ', url);
    // console.log(document);
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: document ? JSON.stringify(document) : null
    }).then(normalizeResponseErrors);
    //.then(res => res.json());
  },
  
  vote: function (document, token) {
    console.log('update running');
    const url = buildUrl(`${VOTE_URL}${document._id}`);
    // console.log('url: ', url);
    // console.log(document);
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: document ? JSON.stringify(document) : null
    }).then(normalizeResponseErrors);
    //.then(res => res.json());
  },
  
  updateVoted: function (document, token) {
    console.log('updateVoted running');
    const url = buildUrl(`${VOTED_URL}${document.username}`);
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: document ? JSON.stringify(document) : null
    }).then(normalizeResponseErrors);
    //.then(res => res.json());
  },

  remove: function (id, token) {
    const url = buildUrl(`${RACES_URL}${id}`);
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.text());
  },
};

function buildUrl(path, query) {
  var url = new URL(path, window.location.origin);
  if (query) {
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
  }
  return url;
}

function normalizeResponseErrors(res) {
  if (!res.ok) {
    if (
      res.headers.has('content-type') &&
      res.headers.get('content-type').startsWith('application/json')
    ) {
      // It's a nice JSON error returned by us, so decode it
      return res.json().then(err => Promise.reject(err));
    }
    // It's a less informative error returned by express
    return Promise.reject({
      code: res.status,
      message: res.statusText
    });
  }
  return res;
}
