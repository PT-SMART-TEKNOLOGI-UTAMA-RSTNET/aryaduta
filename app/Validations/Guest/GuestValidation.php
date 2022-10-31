<?php


namespace App\Validations\Guest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GuestValidation
{
    public function create(Request $request){
        try {
            $valid = Validator::make($request->all(),[
                'name' => "required|string|",
                'email' => "required|string|email|unique:users,email",
                'phone' => "required|numeric|unique:users,phone",
                'alamat' => "nullable|string"
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }

    public function update(Request $request){
        try {
            $valid = Validator::make($request->all(),[
                'name' => "required|string|",
                'id' => "required|string|min:20|exists:users,id",
                'email' => 'required|email|unique:users,email,' . $request->id .',id',
                'phone' => "required|numeric|unique:users,phone,$request->id,id",
                'alamat' => "nullable|string"
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }

    public function delete(Request $request){
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
