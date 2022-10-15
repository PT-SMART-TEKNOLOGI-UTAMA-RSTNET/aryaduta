<?php
function responseFormat($code, $message, $params = null) {
    //dd( $code, $code < 100, $message, $params);
    if (!is_numeric($code) || $code < 100 || $code == null) $code = 500;
    return response()->json((object)[
        'code' => $code,
        'message' => $message,
        'params' => $params
    ], $code);
}
