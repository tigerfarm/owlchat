<?php
// Documentation: https://www.twilio.com/docs/chat/rest/users

if ($argc > 1) {
    $identity = $argv[1];
} else {
    echo "+++ Requires 2 parameter: identity and friendlyName.\xA";
    exit;
}
if ($argc > 1) {
    $friendlyName = $argv[2];
} else {
    echo "+++ Requires 2 parameter: identity and friendlyName.\xA";
    exit;
}

require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
use Twilio\Exceptions\RestException;

$twilio = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));

try {
    $user = $twilio->chat->v2->services(getenv('CHAT_SID'))->users->create($identity);
    $user = $twilio->chat->v2->services(getenv('CHAT_SID'))->users($user->sid)
        ->update(array(
            "friendlyName" => $friendlyName
        ));
    echo "++ " . $user->sid . " " . $user->identity . " FN: " . $user->friendlyName . "\xA";
} catch (RestException $e) {
    echo "+ getMessage(): " . $e->getStatusCode() . " : " . $e->getMessage() . "\xA";
}

?>
