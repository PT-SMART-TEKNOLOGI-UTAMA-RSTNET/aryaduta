<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - {{config('app.name')}}</title>
    <link rel="stylesheet" href="{{asset('theme/mazer/assets/css/main/app.css')}}">
    <link rel="stylesheet" href="{{asset('theme/mazer/assets/css/pages/auth.css')}}">
    <link rel="shortcut icon" href="{{asset('theme/mazer/assets/images/logo/favicon.svg')}}" type="image/x-icon">
    <link rel="shortcut icon" href="{{asset('theme/mazer/assets/images/logo/favicon.png')}}" type="image/png">
</head>

<body>

    <div id="auth"></div>
    <script src="{{asset('js/auth/login.js')}}"></script>

</body>

</html>