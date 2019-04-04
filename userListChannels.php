<?php
// Documentation: https://www.twilio.com/docs/chat/rest/users
require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
$twilio = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));

echo "+ List of users (sid, identity, friendlyName):" . "\xA";
$users = $twilio->chat->v2->services(getenv('CHAT_SID'))->users->read();
foreach ($users as $record) {
    echo "++ " . $record->sid ." " . $record->identity ." FN: " . $record->friendlyName . "\xA";
}
echo "+ End List." . "\xA";
?>
