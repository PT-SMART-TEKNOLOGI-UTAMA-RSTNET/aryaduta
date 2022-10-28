<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Guests\GuestsRepository;
use App\Validations\Guest\GuestValidation;

class GuestsController extends Controller
{
    protected $repository;
    protected $validation;

    public function __construct()
    {
        $this->validation = new GuestValidation();
        $this->repository = new GuestsRepository();
    }

    public function crud(Request $request){
        try{
            $message = "undefined method";
            $params = null;
            $code = 500;
            switch (strtolower($request->method())){
                case 'put' :
                    $message = "Berhasil Menambah Tamu Harap Cek Email Untuk Menerima Password";
                    $code = 200;
                    $valid = $this->validation->create($request);
                    $params = $this->repository->createGuests($valid);
                    break;
                case 'post' :
                    $message = "Berhasil Mengambil Data";
                    $code = 200;
                    $params = $this->repository->table($request);
                    break;
                case 'patch' :
                    $message = "Berhasil Mengubah Data";
                    $code = 200;
                    $valid = $this->validation->update($request);
                    $params = $this->repository->updateGuests($valid);
                    break;
                case 'delete' :
                    $message = "Berhasil Menghapus Data";
                    $code = 200;
                    $valid = $this->validation->delete($request);
                    $params = $this->repository->deleteGuests($valid);
                    break;
            }

            return responseFormat($code,$message,$params);
        }catch (\Exception $e){
            return responseFormat($e->getCode(),$e->getMessage());
        }
    }
}
