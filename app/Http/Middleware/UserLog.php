<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class UserLog
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (auth()->user() != null || auth()->guard('api')->user() != null) {
            $user = auth()->user();
            if ($user == null) {
                $user = auth()->guard('api')->user();
            }
            if ($user != null) {
                $log = new \App\Models\UserLog();
                $log->user = $user->id;
                //dd(Route::getCurrentRoute());
                $log->route = Route::getCurrentRoute() == null ? null : Route::getCurrentRoute()->getName();
                //$log->route = $request->route()->getName();
                $log->url = $request->fullUrl();
                $log->saveOrFail();
            }
        }
        return $next($request);
    }
}
