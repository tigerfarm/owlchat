<?php

class HTTPRequester {
    public static function HTTPGet($AccountSid, $url) {
        $AuthToken = getenv('AUTH_TOKEN');
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_USERPWD, $AccountSid . ":" . $AuthToken);
        curl_setopt($ch, CURLOPT_URL, $url);
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }
}

echo "+++ Start.\xA";
$AccountSid = getenv("ACCOUNT_SID");
$url = "https://chat.ie1.twilio.com/v2/Services/";
echo "+ List Chat services created using 'ie1', URL: " . $url . "\xA";
$http = new HTTPRequester();
$response = $http->HTTPGet($AccountSid, $url . "?" . $dataParms);
echo "+ Response: {$response}";
echo "+++ Exit.\xA";
?>