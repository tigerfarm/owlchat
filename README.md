# Owl Chat Application

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/tigerfarm/owlchat)

When you deploy to Heroku, you will be prompted for an app name. 
The name needs to be unique, example, enter your name+cc (example: davidhero). 
Click Deploy app. Once the application is deployed, click Manage app. 
Set Heroku project environment variables by clicking Settings. 
Click Reveal Config Vars. Add the following key value pair:
````
TOKEN_HOST=your_Twilio_Functions_domain (example: about-time-1235.twil.io)
````
You can view your Your Runtime Domain from here:
````
https://www.twilio.com/console/runtime/overview
````
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

These are the steps to configure to use the Owl Chat Web Application.
No development or credit card information required to try Owl Chat.

Create a Chat Service:

[https://www.twilio.com/console/chat/dashboard](https://www.twilio.com/console/chat/dashboard)

Create an API key and secret string:

[https://www.twilio.com/console/chat/runtime/api-keys](https://www.twilio.com/console/chat/runtime/api-keys)

Create a Twilio Function to generate access tokens:

[https://www.twilio.com/console/runtime/functions/manage](https://www.twilio.com/console/runtime/functions/manage)
````
Friendly name: Generate access token - Chat
Path: /tokenchat
````
Code: use the code in this repository: [generateToken.js](generateToken.js).

Note, the Function URL (https://Function-Runtime-Domain/tokenchat) is used in clientTokenGet.php and nodeHttpServer.js.

Configure your Twilio Function with environment variables:

[https://www.twilio.com/console/runtime/functions/configure](https://www.twilio.com/console/runtime/functions/configure)
````
Add environment variables:
CHAT_SERVICE_SID    : your_value_as_created_above
CHAT_API_KEY        : your_value_as_created_above
CHAT_API_KEY_SECRET : your_value_as_created_above
````
## For Developer, Steps to run the Owl Chat Web Application on your localhost computer

Download this repository's zip into a working directory and unzip it.
Create an environment variable that is your Twilio Function Runtime Domain.
Example:
````
$ export TOKEN_HOST about-time-1235.twil.io

You can view your Your Runtime Domain from here:
https://www.twilio.com/console/runtime/overview

Run the Node.JS server program:
$ node nodeHttpServer.js

Use your browser to go to run the chat client:
http://localhost:8000
Enter a username, example: stacy.
Enter a Channel name and description, example: mychannel, My test channel.

In another browser tab, run another chat client using a different username, same channel name:
http://localhost:8000
Enter a username, example: david.
Enter a Channel name and description, example: mychannel.

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
