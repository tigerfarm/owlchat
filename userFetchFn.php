<?php
if ($argc > 1) {
    $param = $argv[1];
} else {
    echo "+++ Requires a user parameter: SID or identity.\xA";
    exit;
}
// Documentation: https://www.twilio.com/docs/chat/rest/users
require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
use Twilio\Exceptions\RestException;
$twilio = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
try {
    $user = $twilio->chat->v2->services(getenv('CHAT_SID'))->users($param)->fetch();
    // echo "++ " . $user->sid . " " . $user->identity . " FN: " . $user->friendlyName . "\xA";
    echo $user->friendlyName;
} catch (RestException $e) {
    echo "- Error getMessage(): " . $e->getStatusCode() . " : " . $e->getMessage() . "\xA";
}
?>
