exports = {

    getAgentsSendbirdCreds: function(user) {
        //Installation parameters protect Sendbird's API tokn - https://developers.freshdesk.com/v2/docs/installation-parameters/
        //Headers here use templating to pick up the iparam.api_token - https://developers.freshdesk.com/v2/docs/request-method/#sample_requests
        //See iparam.json for the settings
        //Here the api-token is hard coded - don't use this approach in production.
        const options = {
            headers: {
                // "Api-Token": "<%= encode(iparam.api_token) %>",
                "Api-Token": YOUR_SENDBIRD_API_TOKEN,
                "Content-Type": "application/json; charset=utf8"
            }
        }
        $request.get(`https://api-${YOUR_SENDBIRD_APP_ID}.sendbird.com/v3/users/` + user.sendbirdUserId, options)
            .then(
                function (data) {
                    //handle "data"
                    //"data" is a json string with status, headers, and response.
                    renderData(null, data)
                },
                function (error) {
                    // var error = { status: 403, message: "Error while processing the request" };
                    renderData({message: JSON.stringify(error)});
                }
            )
    }
}




