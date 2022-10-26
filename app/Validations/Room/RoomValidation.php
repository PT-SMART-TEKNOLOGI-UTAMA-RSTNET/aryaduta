<?php


namespace App\Validations\Room;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Validator;

class RoomValidation
{
    public function create(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'name' => 'required|string|min:5|unique:rooms,name',
                'nomor_kamar' => 'required|numeric|unique:rooms,number',
                'lantai' => 'required|numeric',
                'kapasitas' => 'required|numeric',
                'harga' => 'required|numeric',
                'harga_minimal' => 'required|numeric',
                'deskripsi' => 'nullable|string',
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 400);
        }
    }

    public function update(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'id' => 'required|string|exists:rooms,id',
                'name' => "required|string|min:5|unique:rooms,name,$request->id",
                'nomor_kamar' => "required|numeric|unique:rooms,number,$request->id",
                'lantai' => 'required|numeric',
                'kapasitas' => 'required|numeric',
                'harga' => 'required|numeric',
                'harga_minimal' => 'required|numeric',
                'deskripsi' => 'nullable|string',
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 400);
        }
    }

    public function delete(Request $request) {
        try {
            $valid = Validator::make($request->all(),[
                'id' => 'required|array',
                'id.*' => 'required|string|min:20|exists:rooms,id',
            ]);
            if ($valid->fails()) throw new \Exception(collect($valid->errors()->all())->join("\n"),400);
            return $request;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 400);
        }
    }

//    public function cekNoKamar(Request $request){
//        try {
//            $valid = Validator::make($request->all(),[
//                'nomor_kamar' => 'unique:rooms,number'
//            ]);
//            if ($valid->fails()) throw new \Exception('Nomor Kamar Sudah Ada',400);
//            return $request;
//        } catch (\Exception $exception) {
//            throw new \Exception($exception->getMessage(), 400);
//        }
//    }

//    public function cekNoKamarUpdate(Request $request){
//        try {
//            $valid = Validator::make($request->all(),[
//                'nomor_kamar' => "unique:rooms,number,$request->id",
//            ]);
//            if ($valid->fails()) throw new \Exception('Nomor Kamar Sudah Ada',400);
//            return $request;
//        } catch (\Exception $exception) {
//            throw new \Exception($exception->getMessage(), 400);
//        }
//    }
}
