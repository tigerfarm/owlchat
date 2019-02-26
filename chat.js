// -----------------------------------------------------------------------------

let thisChatClient = "";
let thisChannel;
let thisToken;

clientId = "";
chatChannelName = "";
chatChannelDescription = "";

// -----------------------------------------------------------------------------
function activateChatBox() {
    $("#message").removeAttr("disabled");
    //
    $("#btn-createChatClient").click(function () {
        createChatClient();
    });
    $("#btn-join").click(function () {
        joinChatChannel();
    });
    $("#btn-list").click(function () {
        listChannels();
    });
    $("#btn-delete").click(function () {
        deleteChannel();
    });
    $("#btn-members").click(function () {
        listMembers();
    });
    $("#btn-count").click(function () {
        doCount();
    });
    // --------------------------------
    $("#btn-chat").click(function () {
        if (thisChatClient === "") {
            addChatMessage("First, create a Chat Client.");
            return;
        }
        const message = $("#message").val();
        if (message === "") {
            return;
        }
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
function listMembers() {
    logger("+ Called: listMembers().");
    var members = thisChannel.getMembers();
    addChatMessage("+ -----------------------");
    addChatMessage("+ Members of this channel:");
    members.then(function (currentMembers) {
        currentMembers.forEach(function (member) {
            if (member.lastConsumedMessageIndex !== null) {
                addChatMessage("++ " + member.identity + ", Last Consumed Message Index = " + member.lastConsumedMessageIndex);
            } else {
                addChatMessage("++ " + member.identity);
            }
        });
    });
}

function doCount() {
    logger("+ Called: doCount().");
    thisChannel.getMessages().then(function (messages) {
        const totalMessages = messages.items.length;
        logger('Total Messages:' + totalMessages);
        addChatMessage("+ -----------------------");
        addChatMessage("+ All current messages:");
        for (i = 0; i < totalMessages; i++) {
            const message = messages.items[i];
            addChatMessage("> " + message.author + " : " + message.body);
        }
        thisChannel.updateLastConsumedMessageIndex(totalMessages);
    });
}

// -----------------------------------------------------------------------------
function createChatClient() {
    clientId = $("#username").val();
    if (clientId === "") {
        logger("Required: Username.");
        addChatMessage("Enter a Username to use when chatting.");
        return;
    }
    addChatMessage("++ Creating Chat Client, please wait.");
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

// -----------------------------------------------------------------------------
function listChannels() {
    if (thisChatClient === "") {
        addChatMessage("First, create a Chat Client.");
        logger("Required: Chat Client.");
        return;
    }
    chatChannelName = $("#channelName").val();
    // Documenation: https://www.twilio.com/docs/chat/channels
    addChatMessage("+ List of public channels (+ uniqueName: friendlyName):");
    thisChatClient.getPublicChannelDescriptors().then(function (paginator) {
        for (i = 0; i < paginator.items.length; i++) {
            const channel = paginator.items[i];
            // Doc: https://www.twilio.com/docs/chat/rest/channels
            let listString = '++ ' + channel.uniqueName + ": " + channel.friendlyName + ": " + channel.createdBy;
            if (channel.uniqueName === chatChannelName) {
                listString += " *";
            }
            addChatMessage(listString);
        }
        addChatMessage("+ End list.");
    });
}

function deleteChannel() {
    logger("Function: deleteChannel()");
    if (thisChatClient === "") {
        addChatMessage("First, create a Chat Client.");
        logger("Required: Chat Client.");
        return;
    }
    chatChannelName = $("#channelName").val();
    if (chatChannelName === "") {
        addChatMessage("Enter a Channel name.");
        logger("Required: Channel name.");
        return;
    }
    thisChatClient.getChannelByUniqueName(chatChannelName)
            .then(function (channel) {
                thisChannel = channel;
                logger("Channel exists: " + chatChannelName + " : " + thisChannel);
                thisChannel.delete().then(function (channel) {
                    addChatMessage('+ Deleted channel: ' + chatChannelName);
                }).catch(function (err) {
                    if (thisChannel.createdBy !== clientId) {
                        addChatMessage("- Can only be deleted by the creator: " + thisChannel.createdBy);
                        // Server side delete: https://www.twilio.com/docs/chat/rest/channels
                    } else {
                        logger("- Delete failed: " + thisChannel.uniqueName + ', ' + err);
                        addChatMessage("- Delete failed: " + err);
                    }
                });
            }).catch(function () {
        logger("Channel doesn't exist.");
        addChatMessage("- Channel doesn't exist, cannot delete it: " + chatChannelName);
    });
}

// -----------------------------------------------------------------------------
function joinChatChannel() {
    logger("Function: joinChatChannel()");
    if (thisChatClient === "") {
        addChatMessage("First, create a Chat Client.");
        logger("Required: Chat Client.");
        return;
    }
    chatChannelName = $("#channelName").val();
    if (chatChannelName === "") {
        addChatMessage("Enter a Channel name.");
        logger("Required: Channel name.");
        return;
    }
    addChatMessage("++ Join the channel: " + chatChannelName);
    thisChatClient.getChannelByUniqueName(chatChannelName)
            .then(function (channel) {
                thisChannel = channel;
                logger("Channel exists: " + chatChannelName + " : " + thisChannel);
                joinChannel();
                //
                logger("+ Channel Attributes: "
                        // + channel.getAttributes()
                        + " SID: " + channel.sid
                        + " name: " + channel.friendlyName
                        );
                //
            }).catch(function () {
        logger("Channel doesn't exist, created the channel.");
        chatChannelDescription = $("#channelDescription").val();
        if (chatChannelDescription === "") {
            chatChannelDescription = chatChannelName;
        }
        thisChatClient.createChannel({
            uniqueName: chatChannelName,
            friendlyName: chatChannelDescription
        }).then(function (channel) {
            logger("Channel created : " + chatChannelName + " " + chatChannelDescription + " : " + channel);
            thisChannel = channel;
            joinChannel();
        }).catch(function (channel) {
            logger('-- Failed to create the channel: ' + channel);
        });
    });
}

// https://www.twilio.com/docs/chat/channels
// A channel is no longer visible to the Client
// thisChatClient.on('channelRemoved', function(channel) {
//   addChatMessage('+ Channel removed: ' + channel.friendlyName);
// });

function joinChannel() {
    logger('Join the channel: ' + thisChannel.uniqueName);
    thisChannel.join().then(function (channel) {
        logger('Joined channel as ' + clientId);
        addChatMessage("+++ Channel joined. You can start chatting.");
    }).catch(function (err) {
        // - Join failed: myChannel3, t: Member already exists
        if (err.message === "Member already exists") {
            // - Join failed: t: Member already exists
            addChatMessage("++ You already exist in the channel.");
        } else {
            logger("- Join failed: " + thisChannel.uniqueName + ' :' + err.message + ":");
            addChatMessage("- Join failed: " + err.message);
        }
        // Use this message for now:
    });
    // Set channel event listener: messages sent to the channel
    thisChannel.on('messageAdded', function (message) {
        onMessageAdded(message);
    });
    // Documenation: https://www.twilio.com/docs/chat/channels
    // 
    // Set channel event listener: typing started
    // activeChannel.on('typingStarted', function (member) {
    //    console.log("Member started typing: " + member);
    // });
    // Set channel event listener: typing ended
    // myChannel.on('typingEnded', function(member) {
    //   console.log(member.identity + 'has stopped typing.');
    // });
}

function onMessageAdded(message) {
    addChatMessage("> " + message.author + " : " + message.body);
}

// -----------------------------------------------------------------------------
var theBar = 0;
function menuicon() {
    // logger("+ Clicked menuicon");
    document.getElementById("menuDropdownItems").classList.toggle("show");
}
function menubar() {
    theBar = 1;
    // logger("+ Clicked menubar");
}
window.onclick = function (e) {
    if (!e.target.matches('.menuicon') && !e.target.matches('.menubar')) {
        if (theBar === 0) {
            // logger("+ Clicked window");
            var dropdowns = document.getElementsByClassName("menuDropdownList");
            for (var d = 0; d < dropdowns.length; d++) {
                var openDropdown = dropdowns[d];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
    theBar = 0;
}

// -----------------------------------------------------------------------------
function logger(message) {
    var aTextarea = document.getElementById('log');
    aTextarea.value += "\n> " + message;
    aTextarea.scrollTop = aTextarea.scrollHeight;
}
function clearLog() {
    log.value = "+ Ready";
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
