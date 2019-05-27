'use strict';

// Example:  node customsearch.js example_term
var request = require('request');
const {
    google
} = require('googleapis');
const customsearch = google.customsearch('v1');

// Ex: node customsearch.js
//      "Google Node.js"
//      "API KEY"
//      "CUSTOM ENGINE ID"
var options = {
    cx: '001323142396507306192:3ad9zcm71hk',
    q: '',
    apiKey: 'AIzaSyBKFd__ZtefwKVa2JsZz_yNG7gJAKZGJFg'
}

async function runSample(qParam) {
    console.log(qParam);
    const res = await customsearch.cse.list({
        cx: options.cx,
        q: qParam.q,
        auth: options.apiKey,
    });
    console.log(res.data);
    return res.data;
}



exports.getAllEvents = function(req, res) {
    // runSample(req.query).then(result => {
    //     console.log(JSON.stringify(result), "<----result");
    //     res.status(200).jsonp(result);
    // }).catch(error => {
    //   res.status(500).jsonp(error);
    // });
    //let event = (new Date((req.query.range_start).split('+')[0])).toISOString();
   // console.log("date--->>>",req.query.range_start, typeof(req.query.range_start),  event)
    let location = req.query.location ? req.query.location : "Gurgaon India";
    //let categories = req.query.catId ? req.query.catId: '';
    let url = `https://www.eventbriteapi.com/v3/events/search/?token=RWJZERSMVZIX74VM6X2I&expand=organizer,venue
      &location.address=${location}`;
      //url = url+ `&start_date.range_start=${req.query.range_start? new Date(req.query.range_start) : null}&start_date.range_end=${req.query.range_end? new Date(req.query.range_end): null}`;
    url = (req.query.catId && req.query.catId != 'undefined') ? (url+'&categories='+ req.query.catId):url;
    let start  = req.query.range_start? req.query.range_start : null;
    console.log(req.query.catId,"request url--->>", url);
    request(url, function(error, response, body) {
      if(res.error){
        console.log('error:', error);
        res.status(400).jsonp(error);
      } else {
        //console.log('body:', body);
        res.status(200).jsonp(JSON.parse(body)); }
        //console.log('statusCode:', response && response.statusCode);
    });
}

// if (module === require.main) {
//     // You can get a custom search engine id at
//     // https://www.google.com/cse/create/new
//     const options = {
//         cx: '001323142396507306192:3ad9zcm71hk',
//         q: 'events in gurgaon',
//         apiKey: 'AIzaSyBKFd__ZtefwKVa2JsZz_yNG7gJAKZGJFg'
//     };
//     runSample(options).catch(console.error);
// }

// module.exports = {
//     runSample,
// };