<?php


namespace App\Validations\Auth;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthValidation
{
    public function register(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'name' => 'required|string|min:2',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),400);
        }
    }
    public function firebaseLogin(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'email' => 'required|email|exists:users,email',
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),400);
        }
    }
    public function login(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'username' => 'required|email|exists:users,email',
                'password' => 'required|string|min:6'
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),400);
        }
    }
}
