<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Guests\GuestsRepository;

class GuestsController extends Controller
{
    protected $repository;

    public function __construct()
    {
        $this->repository = new GuestsRepository();
    }

    public function crud(Request $request){
        try{

        }catch (\Exception $e){
            return responseFormat($e->getCode(),$e->getMessage());
        }
    }
}
