<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\UserLevelController;
use App\Http\Controllers\User\UserPrivilegeController;
use App\Http\Controllers\Regions\RegionsController;
use App\Http\Controllers\Guests\GuestsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'auth'], function (){
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/firebase-login', [AuthController::class, 'firebaseLogin']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::group(['middleware' => ['auth:api']], function (){

    });
});
Route::group(['prefix' => 'users'], function (){
    Route::any('/', [UserController::class, 'crud'])->middleware('auth:api');
    Route::any('/levels', [UserLevelController::class, 'crud'])->middleware('auth:api');
    Route::any('/privileges', [UserPrivilegeController::class, 'crud'])->middleware('auth:api');
});

Route::group(['prefix' => 'regions','middleware' => 'auth:api'],function (){
    Route::post('/provinces',[RegionsController::class,'province']);
    Route::post('/city',[RegionsController::class,'city']);
    Route::post('/district',[RegionsController::class,'district']);
    Route::post('/village',[RegionsController::class,'village']);
});

Route::group(['prefix'=>'guests','middleware' => 'auth:api'],function (){
   Route::any('/crud',[GuestsController::class,'crud']);
});
