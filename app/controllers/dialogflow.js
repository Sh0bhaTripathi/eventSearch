dialogflow = require('dialogflow');
const uuid = require('uuid');
const structjson = require('../lib/structjson.js');
const {
    struct
} = require('pb-util');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} 'testagent-161cb' The project to be used
 */
const projectId = 'affle-47179';
const sessionId = uuid.v4();
//create new context
const contextsClient = new dialogflow.ContextsClient();
// Create a new session
const sessionClient = new dialogflow.SessionsClient();

async function createContext(sessionId, contextId, parameters, lifespanCount = 5) {

    const sessionPath = contextsClient.sessionPath(projectId, sessionId);
    const contextPath = contextsClient.contextPath(
        projectId,
        sessionId,
        contextId
    );

    const request = {
        parent: sessionPath,
        context: {
            name: contextPath,
            parameters: struct.encode(parameters),
            lifespanCount
        }
    };

    const [context] = await contextsClient.createContext(request);

    return context;
}

async function runSample(reqObj) {
    var promise;
    // A unique identifier for the given session


    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: reqObj.query,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    console.log("reqObj---", reqObj.contexts);
    if (reqObj.contexts && reqObj.contexts != 'false') {
        reqObj.contexts = JSON.parse(reqObj.contexts);
        reqObj.contexts.forEach(context => {

            context.parameters = structjson.jsonToStructProto(context.parameters);

        });
        request.queryParams = {
            contexts: reqObj.contexts
        };
        //console.log('context from data',request.queryParams.contexts);
    } else if (reqObj.contextManual) {
        try {
            const context = await createContext(sessionId, reqObj.contextManual, {});
            request.queryParams = {
                contexts: [context]
            };
        } catch (er) {
            console.log("err---->>>", er);
        }
    }
    // Send request and log result

    if (!promise) {
        // First query.
        //console.log(`Sending query ${query}`);
        promise = sessionClient.detectIntent(request);
    } else {
        promise = promise.then(responses => {
            console.log('Detected intent', response);
            const response = responses[0];
            // Use output contexts as input contexts for the next query.
            response.queryResult.outputContexts.forEach(context => {
                // There is a bug in gRPC that the returned google.protobuf.Struct
                // value contains fields with value of null, which causes error
                // when encoding it back. Converting to JSON and back to proto
                // removes those values.
                context.parameters = structjson.jsonToStructProto(
                    structjson.structProtoToJson(context.parameters)
                );
            });
            request.queryParams = {
                contexts: response.queryResult.outputContexts,
            };
            sessionClient.detectIntent(request);
        });
    }
    return promise;
}

exports.detectIntentDialog = function(req, res) {
  console.log("req--->>", req.body);
    runSample(req.body).then(function(responses) {
        const resp = responses[0];
        console.log("resp--->>", resp);

        resp.queryResult.outputContexts.forEach(context => {
            // There is a bug in gRPC that the returned google.protobuf.Struct
            // value contains fields with value of null, which causes error
            // when encoding it back. Converting to JSON and back to proto
            // removes those values.
            context.parameters = structjson.structProtoToJson(context.parameters);
        });
        res.status(200).jsonp(resp.queryResult);
    }).catch(function(errr) {
        console.log("errr---->>>", errr);
        res.status(500).jsonp(errr)
    })
}