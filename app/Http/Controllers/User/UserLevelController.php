<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Repositories\User\UserLevelRepository;
use App\Validations\User\UserLevelValidation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;

class UserLevelController extends Controller
{
    protected $repository;
    protected $validation;
    public function __construct()
    {
        $this->repository = new UserLevelRepository();
        $this->validation = new UserLevelValidation();
    }
    public function crud(Request $request) {
        try {
            $code = 400; $message = 'Undefined method'; $params = null;
            switch (strtolower($request->method())){
                case 'get' :
                case 'post' :
                    $params = $this->repository->table($request);
                    $code = 200; $message = 'ok';
                    break;
                case 'put' :
                    $valid = $this->validation->create($request);
                    $params = $this->repository->create($valid);
                    $code = 200; $message = Lang::get('aryaduta_users.levels.success_create');
                    break;
                case 'patch' :
                    $valid = $this->validation->update($request);
                    $params = $this->repository->update($valid);
                    $code = 200; $message = Lang::get('aryaduta_users.levels.success_update');
                    break;
                case 'delete' :
                    $valid = $this->validation->delete($request);
                    $params = $this->repository->delete($valid);
                    $code = 200; $message = Lang::get('aryaduta_users.levels.success_delete');
                    break;
            }
            return responseFormat($code, $message, $params);
        } catch (\Exception $exception) {
            return responseFormat($exception->getCode(), $exception->getMessage());
        }
    }
}
