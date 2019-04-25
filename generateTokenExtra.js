exports.handler = function(context, event, callback) {
    // Documentation: https://www.twilio.com/docs/api/rest/access-tokens
    //
    let AccessToken = Twilio.jwt.AccessToken;
    let IpMessagingGrant = AccessToken.IpMessagingGrant;
    //
    // The Client using tokens from this Function, receive calls made to this client ID.
    let clientid = event.identity || null;
    if (clientid === null) {
        clientid = context.CLIENT_ID || null;
        if (clientid === null) {
            console.log("-- In Functions Configure, add: CLIENT_ID.");
            return;
        }
    }
    // Client ID must be handled in the related Twilio Function that starts the session.
    console.log("+ Client ID: " + clientid);
    //
    let appName = context.CHAT_APP_NAME;
    let identity = event.clientid;
    let deviceId = "abc"; // event.device;
    let endpointId = `${appName}:${identity}:${deviceId}`;
    //
    // Create an API key and secret string: https://www.twilio.com/console/chat/runtime/api-keys
    const token = new AccessToken(
        context.ACCOUNT_SID,
        context.CHAT_API_KEY,
        context.CHAT_API_KEY_SECRET
    );
    const chatGrant = new AccessToken.ChatGrant({
        serviceSid: context.CHAT_SERVICE_SID,        // Begins with 'IS'
        pushCredentialSid: context.CHAT_PUSH_CREDENTIAL_SID
    });
    token.addGrant(chatGrant);
    token.identity = clientid;
    //
    // Output the token.
    console.log(token.toJwt());
    let response = token.toJwt();
    callback(null, response);
};