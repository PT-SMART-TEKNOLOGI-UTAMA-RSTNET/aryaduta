<?php

namespace App\Http\Controllers\Room;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Room\RoomRepository;
use Exception;
use App\Validations\Room\RoomValidation;

class RoomController extends Controller
{
    protected $repository;
    protected $validation;

    public function __construct()
    {
        $this->validation = new RoomValidation();
        $this->repository = new RoomRepository();
    }

    public function crud(Request $request){
        try{
            $message = "undefined method";
            $code = 500;
            $params = null;

            switch (strtolower($request->method())){
                case 'post' :
                    $message = "Berhasil Ambil Data";
                    $code = 200;
                    $params = $this->repository->table($request);
                    break;
                case 'put' :
                    $message = "Berhasil Menambah Data";
                    $code = 200;
                    $valid = $this->validation->create($request);
                    $params = $this->repository->createRoom($valid);
                    break;
                case 'patch' :
                    $message = "Berhasil Mengubah Data";
                    $code = 200;
                    $valid = $this->validation->update($request);
                    $params = $this->repository->updateRoom($valid);
                    break;
                case 'delete' :
                    $message = "Berhasil Menghapus Data";
                    $code = 200;
                    $valid = $this->validation->delete($request);
                    $params = $this->repository->deleteRoom($valid);
                    break;
            }
            return responseFormat($code, $message, $params);
        }catch (Exception $exception){
            return responseFormat($exception->getCode(),$exception->getMessage());
        }
    }
}
