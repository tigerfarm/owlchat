<?php
require __DIR__ . '/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;
$twilio = new Client(getenv('ACCOUNT_SID'), getenv('AUTH_TOKEN'));
echo "+ List of Chat services:" . "\xA";
$records = $twilio->chat->v2->services->read();
foreach ($records as $record) {
    echo "++ " . $record->sid ." " . " FN: " . $record->friendlyName . "\xA";
}
echo "+ End List." . "\xA";
?>
