// -----------------------------------------------------------------------------

let thisChatClient;
let thisChannel;
let thisToken;

clientId = "";
chatChannelName = "myChannel3";
chatChannelDescription = "My channel for learning";

// -----------------------------------------------------------------------------
function activateChatBox() {
    $("#message").removeAttr("disabled");
    //
    $("#btn-createChatClient").click(function () {
        logger("Create Chat Client...");
        createChatClient();
    });
    $("#btn-join").click(function () {
        joinChatChannel();
    });
    $("#btn-list").click(function () {
        listChannels();
    });
    $("#btn-stop").click(function () {
        logger("Stop no available, yet.");
    });
    // --------------------------------
    $("#btn-chat").click(function () {
        const message = $("#message").val();
        $("#message").val("");
        thisChannel.sendMessage(message);
    });
    $("#message").on("keydown", function (e) {
        if (e.keyCode === 13) {
            $("#btn-chat").click();
        }
    });
    // --------------------------------
}

// -----------------------------------------------------------------------------

function createChatClient() {
    clientId = $("#username").val();
    if (clientId === "") {
        logger("Username: Required.");
        return;
    }
    // Since, programs cannot make an Ajax call to a remote resource,
    // Need to do an Ajax call to a local program that goes and gets the token.
    logger("Refresh the token using client id: " + clientId);
    var jqxhr = $.get("clientTokenGet.php?clientid=" + clientId, function (token) {
        thisToken = token;
        // logger("thisToken 1:" + thisToken + ":");
        logger("Token refreshed.");
        // -------------------------------
        // Documentation: https://www.twilio.com/docs/chat/initializing-sdk-clients
        // I would need to make change to get this to work: thisChatClient = new Twilio.Chat.Client.create(token);
        Twilio.Chat.Client.create(token).then(chatClient => {
            thisChatClient = chatClient;
            logger("Chat client created: thisChatClient: " + thisChatClient);
            addChatMessage("+ Chat client created for the user: " + clientId);
            thisChatClient.getSubscribedChannels();
            // thisChatClient.getSubscribedChannels().then(joinChatChannel);
        });
    }).fail(function () {
        logger("- Error refreshing the token.");
    });
}

function listChannels() {
    // Documenation: https://www.twilio.com/docs/chat/channels
    addChatMessage("+ List of public channels (+ uniqueName: friendlyName):");
    thisChatClient.getPublicChannelDescriptors().then(function (paginator) {
        chatChannelNameExist = false;
        for (i = 0; i < paginator.items.length; i++) {
            const channel = paginator.items[i];
            if (channel.uniqueName === chatChannelName) {
                chatChannelNameExist = true;
                addChatMessage('++ ' + channel.uniqueName + ": " + channel.friendlyName + " *");
            } else {
                addChatMessage('++ ' + channel.uniqueName + ": " + channel.friendlyName);
            }
        }
        addChatMessage("+ End list.");
    });
}

// -----------------------------------------------------------------------------
function joinChatChannel() {
    logger("Function: joinChatChannel()");
    addChatMessage("++ Join the channel: " + chatChannelName);
    thisChatClient.getChannelByUniqueName(chatChannelName)
            .then(function (channel) {
                thisChannel = channel;
                logger("Channel exists: " + chatChannelName + " : " + thisChannel);
                joinChannel();
            }).catch(function () {
        logger("Channel doesn't exist, created the channel.");
        thisChatClient.createChannel({
            uniqueName: chatChannelName,
            friendlyName: chatChannelDescription
        }).then(function (channel) {
            logger("Channel created : " + chatChannelName + " " + chatChannelDescription);
            logger(channel);
            thisChannel = channel;
            joinChannel();
        }).catch(function (channel) {
            logger('-- Failed to create the channel: ' + channel);
        });
    });
}

function joinChannel() {
    // documenation: https://www.twilio.com/docs/chat/channels
    logger('Join the channel: ' + thisChannel.uniqueName);
    // Need to handle error: Member already exists.
    thisChannel.join().then(function (channel) {
        logger('Joined channel as ' + clientId);
        addChatMessage("+++ Channel joined. You can start chatting.");
    }).catch(function (err) {
        logger("- Join failed: " + thisChannel.uniqueName + ', ' + err);
        // - Join failed: myChannel3, t: Member already exists
        // However, the following doesn't work:
        if (err === "t: Member already exists") {
            addChatMessage("++ You are already joined in the channel.");
        }
        // Use this message for now:
        addChatMessage("- Join failed: " + err);
    });
    // Set channel event listener: messages sent to the channel
    thisChannel.on('messageAdded', function (message) {
        onMessageAdded(message);
    });
    // Set channel event listener: typing started
    // activeChannel.on('typingStarted', function (member) {
    //    console.log("Member started typing: " + member);
    // });
}

function onMessageAdded(message) {
    addChatMessage("> " + message.author + " : " + message.body);
}

function logger(message) {
    var aTextarea = document.getElementById('log');
    aTextarea.value += "\n> " + message;
    aTextarea.scrollTop = aTextarea.scrollHeight;
}
function addChatMessage(message) {
    var aTextarea = document.getElementById('chatMessages');
    aTextarea.value += "\n" + message;
    aTextarea.scrollTop = aTextarea.scrollHeight;
}
window.onload = function () {
    log.value = "+++ Start.";
    chatMessages.value = "+++ Ready to Create Chat Client, then join a chat channel and chat.";
    // createChatClient();
    activateChatBox();
};

// -----------------------------------------------------------------------------
