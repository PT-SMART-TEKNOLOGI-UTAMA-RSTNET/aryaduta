<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () { return view('home'); });
Route::group(['prefix' => 'auth'], function (){
    Route::get('/login', function (){ return view('auth.login'); })->name('login');
    Route::get('/register', function (){ return view('auth.register'); });
});

Route::get('/dashboard', function (){ return view('dashboard'); });

Route::group(['prefix' => 'rooms'], function (){
    Route::get('/', function (){ return view('rooms.rooms'); })->name('rooms');
    Route::get('/reservations', function (){ return view('rooms.reservations'); })->name('rooms.reservations');
    Route::get('/usages', function (){ return view('rooms.usages'); })->name('rooms.usages');
});
Route::group(['prefix' => 'guests'], function (){
    Route::get('/', function (){ return view('guests.guests'); })->name('guests');
});
Route::group(['prefix' => 'users'], function (){
    Route::get('/', function (){ return view('users.users'); })->name('users');
    Route::get('/levels', function (){ return view('users.levels'); })->name('users.levels');
    Route::get('/privileges', function (){ return view('users.privileges'); })->name('users.privileges');
});
Route::group(['prefix' => 'wifi'], function (){
    Route::get('/', function (){ return view('wifi.wifi'); })->name('wifi');
    Route::get('/routers', function (){ return view('wifi.routers'); })->name('wifi.routers');
    Route::group(['prefix' => 'profiles'], function (){
        Route::get('/pools', function (){ return view('wifi.profiles.pools'); })->name('wifi.profiles.pools');
        Route::get('/pppoe', function (){ return view('wifi.profiles.pppoe'); })->name('wifi.profiles.pppoe');
        Route::get('/hotspot', function (){ return view('wifi.profiles.hotspot'); })->name('wifi.profiles.hotspot');
    });
    Route::group(['prefix' => 'users'], function (){
        Route::get('/pppoe', function (){ return view('wifi.users.pppoe'); })->name('wifi.users.pppoe');
        Route::get('/hotspot', function (){ return view('wifi.users.hotspot'); })->name('wifi.users.hotspot');
    });
});
