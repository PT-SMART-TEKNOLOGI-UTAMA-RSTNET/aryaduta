<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Repositories\Auth\AuhtRepository;
use App\Validations\Auth\AuthValidation;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $validation;
    protected $repository;
    public function __construct()
    {
        $this->validation = new AuthValidation();
        $this->repository = new AuhtRepository();
    }
    public function register(Request $request) {
        try {
            $valid = $this->validation->register($request);
            $params = $this->repository->register($valid);
            return responseFormat(200,'Pendaftaran berhasil', $params);
        } catch (\Exception $exception) {
            return responseFormat($exception->getCode(), $exception->getMessage());
        }
    }
    public function forgotPassword(Request $request) {
        try {
            $valid = $this->validation->forgotPassword($request);
            $params = $this->repository->forgotPassword($valid);
            return responseFormat(200,'ok', $params);
        } catch (\Exception $exception) {
            return responseFormat($exception->getCode(), $exception->getMessage());
        }
    }
    public function firebaseLogin(Request $request) {
        try {
            $valid = $this->validation->firebaseLogin($request);
            $params = $this->repository->firebaseLogin($valid);
            return responseFormat(200,'ok', $params);
        } catch (\Exception $exception) {
            return responseFormat($exception->getCode(), $exception->getMessage());
        }
    }
    public function login(Request $request) {
        try {
            $valid = $this->validation->login($request);
            $params = $this->repository->login($valid);
            return responseFormat(200,'ok', $params);
        } catch (\Exception $exception) {
            return responseFormat($exception->getCode(), $exception->getMessage());
        }
    }
}
