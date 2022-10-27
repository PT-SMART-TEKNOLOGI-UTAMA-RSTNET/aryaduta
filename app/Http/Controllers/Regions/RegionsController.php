<?php

namespace App\Http\Controllers\Regions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\RegionsRepository\RegionsRepository;

class RegionsController extends Controller
{
    protected $repository;
    public function __construct()
    {
        $this->repository = new RegionsRepository();
    }

    public function province(Request $request)
    {
        try {
           $params = $this->repository->province($request);
            return responseFormat(200, 'ok', $params);
        } catch (\Exception $exception) {
            return responseFormat($exception->getCode(), $exception->getMessage());
        }
    }
    public function city(Request $request)
    {
        try {
            $params = $this->repository->city($request);
            return responseFormat(200, 'ok', $params);
        } catch (\Exception $exception) {
            return responseFormat($exception->getCode(), $exception->getMessage());
        }
    }
    public function district(Request $request)
    {
        try {
            $params = $this->repository->district($request);
            return responseFormat(200, 'ok', $params);
        } catch (\Exception $exception) {
            return responseFormat($exception->getCode(), $exception->getMessage());
        }
    }
    public function village(Request $request)
    {
        try {
            $params = $this->repository->village($request);
            return responseFormat(200, 'ok', $params);
        } catch (\Exception $exception) {
            return responseFormat($exception->getCode(), $exception->getMessage());
        }
    }
}
