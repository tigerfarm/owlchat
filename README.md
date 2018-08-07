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

## Twilio Console Configuration

These are the steps to configure to use the Owl Chat Web Application.
No development or credit card information required to try Owl Chat.

````
+ Create a Chat Service:
https://www.twilio.com/console/chat/dashboard

+ Create an API key and secret string:
https://www.twilio.com/console/chat/runtime/api-keys

+ Create a Twilio Function to create Chat access tokens.
````
++ Use the code in this repository: [generateToken.js](generateToken.js).

## For Developer, Steps to run the Owl Chat Web Application on your localhost computer

Download this repository's zip into a working directory and unzip it.
Create an environment variable that is your Twilio Function Runtime Domain.
````
+ You can view your Your Runtime Domain from here:
https://www.twilio.com/console/runtime/overview

Run the Node.JS server program:
$ node nodeHttpServer.js

Use your browser to go to run chat client:
http://localhost:8000

In another browser, run chat client:
http://localhost:8000

Send messages between your browsers.
````

## Adding Server Side Chat features:

List members of a channel:
````
https://www.twilio.com/docs/chat/rest/members
````

Delete a channel of which you are not the creator:
````
https://www.twilio.com/docs/chat/rest/channels
````

Cheers...
