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
    $("#btn-start").click(function () {
        logger("Start...");
        clientId = $("#username").val();
        if (clientId === "") {
            logger("Username: Required.");
        } else {
            logger("Username: " + clientId);
            startSession();
        }
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
    let template = $("#new-message").html();
    template = template.replace(
            "{{body}}",
            "<b>Chat Setup Completed. You can start chatting.</b>"
            );

    $(".chat").append(template);
}

function chatSetupFailed() {
    let template = $("#new-message").html();
    template = template.replace(
            "{{body}}",
            "<b>Chat Setup Failed. Please Contact Admin.</b>"
            );

    $(".chat").append(template);
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
            thisChatClient.getSubscribedChannels().then(createOrJoinGeneralChannel);
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
                thisChannel = channel;
                logger('+ ' + thisChannel.uniqueName + ": " + thisChannel.friendlyName + " *");
            } else {
                logger('+ ' + channel.uniqueName + ": " + channel.friendlyName);
            }
        }
        logger("End list.");
    });
}

// -----------------------------------------------------------------------------
function joinChatChannel() {
    logger('Join the channel: ' + thisChannel.uniqueName);
    // logger("thisChatClient.uniqueName: " + thisChatClient.uniqueName);
    setupChannel();
}

function createOrJoinGeneralChannel() {
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
        // printMessage(message.author, message.body);  // this is better
    });
}

function onMessageAdded(message) {
    logger("onMessageAdded...");
    let template = $("#new-message").html();
    template = template.replace(
            "{{body}}",
            `<b>${message.author}:</b> ${message.body}`
            );
    $(".chat").append(template);
}
// Better version of onMessageAdded
function printMessage(fromUser, message) {
    var $user = $('<span class="username">').text(fromUser + ':');
    if (fromUser === username) {
        $user.addClass('me');
    }
    var $message = $('<span class="message">').text(message);
    var $container = $('<div class="message-container">');
    $container.append($user).append($message);
    $chatWindow.append($container);
    $chatWindow.scrollTop($chatWindow[0].scrollHeight);
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
window.onload = function () {
    log.value = "+++ Start.";
    // setClientId();
    // refresh();
    // doGetToken();
    activateChatBox();
};

// -----------------------------------------------------------------------------
