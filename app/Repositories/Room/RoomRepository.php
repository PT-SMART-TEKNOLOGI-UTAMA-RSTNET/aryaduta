<?php


namespace App\Repositories\Room;
use App\Models\Room\Room;

use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class RoomRepository
{
    public function createRoom(Request $request){
        try{
            $user = auth()->guard('api')->user();
            if($request->harga_minimal > $request->harga){
                throw new \Exception("Harga Minimal Tidak Boleh Lebih Besar Dari Harga");
            }

            if($request->nomor_kamar === 0){
                throw new \Exception("Nomor Kamar Tidak Boleh 0");
            }
            $room = new Room();
            $room->id = Uuid::uuid4()->toString();
            $room->number = $request->nomor_kamar;
            $room->name = $request->name;
            $room->floor = $request->lantai;
            $room->capacity = $request->kapasitas;
            $room->price = $request->harga;
            $room->price_min = $request->harga_minimal;
            $room->description = $request->deskripsi;
            $room->created_by = $user->id;
            $room->saveOrFail();
            return true;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage(),500);
        }
    }

    public function updateRoom(Request $request){
        try{
            $user = auth()->guard('api')->user();
            if($request->harga_minimal > $request->harga){
                throw new \Exception("Harga Minimal Tidak Boleh Lebih Besar Dari Harga");
            }
            if($request->nomor_kamar === 0){
                throw new \Exception("Nomor Kamar Tidak Boleh 0");
            }
            $room = Room::where('id', $request->id)->first();
            $room->number = $request->nomor_kamar;
            $room->name = $request->name;
            $room->floor = $request->lantai;
            $room->capacity = $request->kapasitas;
            $room->price = $request->harga;
            $room->price_min = $request->harga_minimal;
            $room->description = $request->deskripsi;
            $room->updated_by = $user->id;
            $room->saveOrFail();
            return true;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage(),500);
        }
    }

    public function deleteRoom(Request $request){
        try{
            Room::whereIn('id',$request->id)->delete();
            return true;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage(),500);
        }
    }

    public function table(Request $request){
        try{
            $respons = collect([]);
            $rooms = Room::orderBy('created_at','desc')->get();
            foreach ($rooms as $room){
                $respons->push([
                   'value' => $room->id,
                   'label' => $room->name,
                   'meta' => [
                       'nomor' => $room->number,
                       'lantai' => $room->floor,
                       'harga' => $room->price,
                       'kapasitas' => $room->capacity,
                       'harga_minimal' => $room->price_min,
                       'deskripsi' => $room->description,
                       'created' => [
                         'by' => $room->createdBy,
                         'at'=>$room->created_at
                       ],
                       'updated_at' => [
                         'by' => $room->updatedBy,
                         'at' => $room->updated_at
                       ],
                   ]
                ]);
            }
            return $respons;
        }catch (\Exception $exception){
            throw new \Exception($exception->getMessage(),500);
        }
    }
}
