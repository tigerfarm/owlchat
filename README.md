# Owl Chat Application

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/tigerfarm/owlc)

When you deploy to Heroku, you will be prompted for an app name. 
The name needs to be unique, example, enter your name+cc (example: davidcc). 
Click Deploy app. Once the application is deployed, click Manage app. 
Set Heroku project environment variables by clicking Settings. 
Click Reveal Config Vars. Add the following key value pair:
````
TOKEN_HOST=your_Twilio_Functions_domain (example: about-time-1235.twil.io)
````

These are the steps to implement a Twilio JavaScript Web Client using Twilio Functions.

````
+ Create a Chat Service:
https://www.twilio.com/console/chat/dashboard

+ Create an API key and secret string:
https://www.twilio.com/console/chat/runtime/api-keys

+ Create Twilio Function to create Chat access tokens.
++ Use the code in tokenchat.js (this repository).

Download this repository's zip into a working directory and unzip it.
Create an environment variable that is your Twilio Function Your Runtime Domain.
+ You can view your Your Runtime Domain from here:
https://www.twilio.com/console/runtime/overview

Run the Node server program:
$ node nodeHttpServer.js

Use your browser to go to the chat window:
http://localhost:8000

Use a text editor to change the username in index.js.
In another browser, go to the chat window:
http://localhost:8000

Send messages.
````


Requirements:

- Twilio account. A free Trial account will work.
- NodeJS installed to run the Client locally on your computer.



Cheers...
