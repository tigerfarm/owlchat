<?php
// Documentation: https://www.twilio.com/docs/chat/rest/users
require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
use Twilio\Exceptions\RestException;

$twilio = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));

try {
    $user = $twilio->chat->v2->services(getenv('CHAT_SID'))->users->create("test1");
    $user = $twilio->chat->v2->services(getenv('CHAT_SID'))->users($user->sid)
        ->update(array(
            "friendlyName" => "test me 7"
        ));
    echo "++ " . $user->sid . " " . $user->identity . " FN: " . $user->friendlyName . "\xA";
} catch (RestException $e) {
    echo "+ getMessage(): " . $e->getStatusCode() . " : " . $e->getMessage() . "\xA";
}

?>
