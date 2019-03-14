<?php
// Documentation: https://www.twilio.com/docs/chat/rest/users
require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
use Twilio\Exceptions\RestException;
$twilio = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
echo "+ Fetch user data:" . "\xA";
try {
    $user = $twilio->chat->v2->services(getenv('CHAT_SID'))->users("AC")->fetch();
    echo "++ " . $user->sid . " " . $user->identity . " FN: " . $user->friendlyName . "\xA";
} catch (RestException $e) {
    echo "+ getMessage(): " . $e->getStatusCode() . " : " . $e->getMessage() . "\xA";
}
echo "+ End." . "\xA";
?>
