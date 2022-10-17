<?php


namespace App\Validations\User;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserLevelValidation
{
    public function create(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'name' => 'required|string|min:2|unique:user_levels,name',
                'description' => 'nullable'
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),400);
        }
    }
    public function update(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'id' => 'required|string|min:20|exists:user_levels,id',
                'name' => 'required|string|min:2|unique:user_levels,name,' . $request->id . ',id',
                'description' => 'nullable'
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),400);
        }
    }
    public function delete(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'id' => 'required|string|min:20|exists:user_levels,id',
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),400);
        }
    }
}
