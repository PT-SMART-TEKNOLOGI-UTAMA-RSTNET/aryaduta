<?php


namespace App\Validations\User;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use function GuzzleHttp\Promise\all;

class UserPrivilegeValidation
{
    public function update(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'level' => 'required|string|min:20|exists:user_levels,id',
                'checked' => 'required|numeric|min:0|max:1',
                'privilege' => 'required|string|min:20|exists:user_privileges,id',
                'type' => 'required|string|in:c,r,u,d'
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),400);
        }
    }
}
