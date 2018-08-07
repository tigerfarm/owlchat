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
    $("#btn-refresh").click(function () {
        logger("Refresh...");
        refresh();
    });
    $("#btn-list").click(function () {
        listChannels();
    });
    $("#btn-join").click(function () {
        joinChatChannel();
    });
    $("#btn-stop").click(function () {
        logger("Stop no available, yet.");
    });
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
}
function chatSetupCompleted() {
    addChatMessage("+++ Chat Setup Completed. You can start chatting.");
}

function chatSetupFailed() {
    addChatMessage("--- Chat Setup Failed.");
}

// -----------------------------------------------------------------------------

function refresh() {
    clientId = $("#username").val();
    if (clientId === "") {
        logger("Username: Required.");
        return;
    }
    // Since, programs cannot make an Ajax call to a remote resource,
    // Need to do an Ajax call to a local program that goes and gets the token.
    logger("Refresh the token using client id: " + clientId);
    //
    var jqxhr = $.get("clientTokenGet.php?clientid=" + clientId, function (token) {
        thisToken = token;
        // logger("thisToken 1:" + thisToken + ":");
        logger("Token refreshed.");
        // -------------------------------
        // Documentation: https://www.twilio.com/docs/chat/initializing-sdk-clients
        // Didn't work: thisChatClient = new Twilio.Chat.Client.create(token);
        Twilio.Chat.Client.create(token).then(chatClient => {
            thisChatClient = chatClient;
            logger("Chat client created: thisChatClient: " + thisChatClient);
            thisChatClient.getSubscribedChannels().then(createOrJoinChannel);
            chatSetupCompleted();
        });
    }).fail(function () {
        logger("- Error refreshing the token.");
    });
}

function listChannels() {
    // Documenation: https://www.twilio.com/docs/chat/channels
    logger("List of public channels (+ uniqueName: friendlyName):");
    thisChatClient.getPublicChannelDescriptors().then(function (paginator) {
        chatChannelNameExist = false;
        for (i = 0; i < paginator.items.length; i++) {
            const channel = paginator.items[i];
            if (channel.uniqueName === chatChannelName) {
                chatChannelNameExist = true;
                addChatMessage('+ ' + thisChannel.uniqueName + ": " + thisChannel.friendlyName + " *");
            } else {
                addChatMessage('+ ' + channel.uniqueName + ": " + channel.friendlyName);
            }
        }
        logger("End list.");
    });
}

// -----------------------------------------------------------------------------
function joinChatChannel() {
    logger('Join the channel: ' + thisChannel.uniqueName);
    // logger("thisChatClient.uniqueName: " + thisChatClient.uniqueName);
    createOrJoinChannel();
}

function createOrJoinChannel() {
    // Get the general chat channel, which is where all the messages are
    // sent in this simple application
    logger("Join channel: " + chatChannelName);
    thisChatClient.getChannelByUniqueName(chatChannelName)
            .then(function (channel) {
                thisChannel = channel;
                logger("Found channel: " + chatChannelName + " : " + thisChannel);
                setupChannel();
            }).catch(function () {
        // If it doesn't exist, let's create it
        logger('Creating general channel');
        thisChatClient.createChannel({
            uniqueName: chatChannelName,
            friendlyName: 'My Chat Channel'
        }).then(function (channel) {
            logger("Created " + chatChannelName + " channel: ");
            logger(channel);
            thisChannel = channel;
            setupChannel();
        }).catch(function (channel) {
            logger('Channel could not be created:');
            logger(channel);
        });
    });
}

// Set up channel after it has been found
function setupChannel() {
    logger('Join the channel: ' + thisChannel.uniqueName);
    thisChannel.join().then(function (channel) {
        logger('Joined channel as ' + clientId);
    });
    // Listen for new messages sent to the channel
    thisChannel.on('messageAdded', function (message) {
        onMessageAdded(message);
    });
}

function onMessageAdded(message) {
    addChatMessage("> " + message.author + " : " + message.body);
}

// -----------------------------------------------------------------------------
/*
 * From the documenation: https://www.twilio.com/docs/chat/channels
 
 // Listen for new messages sent to a channel
 myChannel.on('messageAdded', function(message) {
 console.log(message.author, message.body);
 });
 
 // Set up the listener for the typing started Channel event
 activeChannel.on('typingStarted', function(member) {
 console.log("Member started typing: " + member);
 });
 
 */

function setClientId() {
    clientId = $("#username").val();
    if (clientId === "") {
        logger("Username: Required.");
    } else {
        logger("Username: " + clientId);
    }
}

function logger(message) {
    var log = document.getElementById('log');
    log.value += "\n> " + message;
    log.scrollTop = log.scrollHeight;
}
function addChatMessage(message) {
    var aChatMessages = document.getElementById('chatMessages');
    aChatMessages.value += "\n" + message;
    aChatMessages.scrollTop = aChatMessages.scrollHeight;
}
window.onload = function () {
    log.value = "+++ Start.";
    chatMessages.value = "+++ Ready to refresh and then chat.";
    // setClientId();
    // refresh();
    // doGetToken();
    activateChatBox();
};

// -----------------------------------------------------------------------------
