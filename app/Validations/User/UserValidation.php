<?php


namespace App\Validations\User;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserValidation
{
    public function create(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'level' => 'required|string|exists:user_levels,id',
                'name' => 'required|string|min:2',
                'email' => 'required|email|unique:users,email',
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            if (strlen($request->password) > 0) {
                $valid = Validator::make($request->all(),[
                    'password' => 'required|string|min:6|confirmed'
                ]);
                if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            }
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function update(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'id' => 'required|string|min:20|exists:users,id',
                'level' => 'required|string|exists:user_levels,id',
                'name' => 'required|string|min:2',
                'email' => 'required|email|unique:users,email,' . $request->id .',id',
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            if (strlen($request->password) > 0) {
                $valid = Validator::make($request->all(),[
                    'password' => 'required|string|min:6|confirmed'
                ]);
                if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            }
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function delete(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'id' => 'required|array|min:1',
                'id.*' => 'required|string|min:20|exists:users,id',
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
}
