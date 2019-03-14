<?php
// Documentation: https://www.twilio.com/docs/chat/rest/users
require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
$twilio = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));

echo "+ Delete users (sid, identity):" . "\xA";
$users = $twilio->chat->v2->services(getenv('CHAT_SID'))->users->read();
foreach ($users as $record) {
    $twilio->chat->v2->services(getenv('CHAT_SID'))->users($record->sid)->delete();
    echo "++ Deleted: " . $record->sid ." " . $record->identity ." " . $record->friendlyName . "\xA";
}
echo "+ End List." . "\xA";
?>
