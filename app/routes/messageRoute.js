'use strict';
// /**
//  * Admin Routes.
// Author Name: Shobha Tripathi
//  */

var dialog = require('./../controllers/dialogflow'),
//     config = require('./../../config/config'),
    gsearch = require('./../controllers/googleSearch');

module.exports = function(app, router) {
    //router.post('/getAllAdBrand', ads.getAllAdsOfBrand);
   // console.log("udhsfd")
    router.post('/detectIntent', dialog.detectIntentDialog);

    router.get('/getAllEvents', gsearch.getAllEvents);
    
    router.get('/routeCheck', function(req, res) {
         res.send("route check");
    });

};