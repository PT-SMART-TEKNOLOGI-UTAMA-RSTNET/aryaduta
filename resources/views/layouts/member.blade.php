<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - {{config('app.name')}}</title>

    <link rel="stylesheet" href="{{asset('theme/mazer/assets/css/main/app.css')}}">
    <link rel="stylesheet" href="{{asset('theme/mazer/assets/css/main/app-dark.css')}}">
    <link rel="shortcut icon" href="{{asset('theme/mazer/assets/images/logo/favicon.svg')}}" type="image/x-icon">
    <link rel="shortcut icon" href="{{asset('theme/mazer/assets/images/logo/favicon.png')}}" type="image/png">

    <link rel="stylesheet" href="{{asset('theme/mazer/assets/css/shared/iconly.css')}}">
    <link rel="stylesheet" href="{{asset('css/app.css')}}">

</head>

<body>
<div id="app">
    @yield('contents')
</div>

@yield('scripts')

<script src="{{asset('theme/mazer/assets/js/bootstrap.js')}}"></script>
<script src="{{asset('theme/mazer/assets/js/app.js')}}"></script>
{{--<script src="{{asset('theme/mazer/assets/extensions/apexcharts/apexcharts.min.js')}}"></script>
<script src="{{asset('theme/mazer/assets/js/pages/dashboard.js')}}"></script>--}}



</body>

</html>
