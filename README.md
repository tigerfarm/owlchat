# Chat Application

If you would like an Heroku account to deploy and use this web application,
go to this [link (https://heroku.com)](https://heroku.com) and you can Sign up for free, and use it for free.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/tigerfarm/owlchat)

When you deploy to Heroku, you will be prompted for an app name. 
The name needs to be unique. Example, use your name+hero (example: davidhero). 
Click Deploy app. Once the application is deployed, click Manage app. 
Set Heroku project environment variables by clicking Settings. 
Click Reveal Config Vars. Add the following key value pair:
````
TOKEN_HOST=your_Twilio_Functions_runtime_domain (example: about-time-1235.twil.io)
````
You can view your Your Runtime Domain from here:
````
https://www.twilio.com/console/runtime/overview
````

Chat Screen print:

<img src="Tiger_Chat.jpg"/>

### Requirements:

- Twilio account. A free Trial account will work.
- To run locally on your computer using the include web server, install Node.JS and the Twilio Node.JS helper library.

## Files

- [index.html](index.html) : Chat client HTML
- [chat.css](chat.css) : Chat client styles, CSS
- [chat.js](chat.js) : Chat client JavaScript
- [clientTokenGet.php](clientTokenGet.php) : a program that calls your Twilio Function (generateToken.js).
  This is used when hosting the client remotely on a public PHP capable website.
- [generateToken.js](generateToken.js) : generates and returns an access token.
- [nodeHttpServer.js](nodeHttpServer.js) : a NodeJS HTTP Server that serves the Chat client files and calls your Twilio Function (generateToken.js).
  This is used to run the client locally on a computer.
- [echoVars.php](echoVars.php) : Echo your environment variables that are used in clientTokenGet.php.
- [app.json](app.json) : Heroku deployment file to describe the application.
- [composer.json](composer.json) : Heroku deployment file which sets the programming language used.

## Twilio Console Configuration

These are the steps to configure to use the Chat Web Application.
No development or credit card information required to try Chat.

1. Create a Chat Service:

[https://www.twilio.com/console/chat/dashboard](https://www.twilio.com/console/chat/dashboard)

2. Create an API key and secret string:

[https://www.twilio.com/console/chat/runtime/api-keys](https://www.twilio.com/console/chat/runtime/api-keys)

3. Create a Twilio Function to generate access tokens:

[https://www.twilio.com/console/runtime/functions/manage](https://www.twilio.com/console/runtime/functions/manage)
````
Friendly name: Generate access token - Chat
Path: /tokenchat (This path name is used in other programs)
````
Code: use the code in this repository file: [generateToken.js](generateToken.js).

Note, the Function URL (https://Function-Runtime-Domain/tokenchat) is used in clientTokenGet.php and nodeHttpServer.js.

4. Configure your Twilio Function environment variables:

[https://www.twilio.com/console/runtime/functions/configure](https://www.twilio.com/console/runtime/functions/configure)

4.1 Enable ACCOUNT_SID and AUTH_TOKEN. This allows your Twilio Function to use your ACCOUNT_SID.

4.2 Add environment variables:
````
CHAT_SERVICE_SID    : your_value_as_created_above
CHAT_API_KEY        : your_value_as_created_above
CHAT_API_KEY_SECRET : your_value_as_created_above
````
## For Developers

Following are the steps to run the Chat Web Application on your localhost computer.

Download this repository's zip into a working directory and unzip it.
Create an environment variable that is your Twilio Function Runtime Domain.
Example:
````
$ export TOKEN_HOST about-time-1235.twil.io
````
You can view your Your Runtime Domain from here:
````
https://www.twilio.com/console/runtime/overview
````
Run the Node.JS server program:
````
$ node nodeHttpServer.js
````
### Test
````
Use your browser to run the chat client:
http://localhost:8000
Enter a username, example: stacy.
Enter a Channel name and description, example: "mychannel" and "My test channel".

In another browser tab, run another chat client using a , same channel name:
http://localhost:8000
Enter a username, example: david (different username).
Enter a Channel name, example: mychannel (same as the other client).

Send messages between your clients.
````

## Future options: Add Server Side Chat features:

List members of a channel:
````
https://www.twilio.com/docs/chat/rest/members
````

Delete a channel of which you are not the creator:
````
https://www.twilio.com/docs/chat/rest/channels
````

Cheers...
