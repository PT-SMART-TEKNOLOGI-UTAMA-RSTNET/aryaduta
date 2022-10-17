<?php


namespace App\Repositories\User;


use App\Models\Menu;
use App\Models\UserLevel;
use App\Models\UserPrivilege;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class UserLevelRepository
{
    public function update(Request $request) {
        try {
            $auth = auth()->guard('api')->user();

            $levels = UserLevel::where('id', $request->id)->first();
            $levels->name = $request->name;
            $levels->description = $request->description;
            $levels->updated_by = $auth == null ? null : $auth->id;
            $levels->saveOrFail();

            return $this->table(new Request(['id' => $levels->id]))->first();
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function delete(Request $request) {
        try {
            $auth = auth()->guard('api')->user();

            $levels = UserLevel::where('id', $request->id)->first();
            $levels->deleted_by = $auth == null ? null : $auth->id;
            $levels->saveOrFail();

            UserLevel::where('id', $request->id)->delete();

            return true;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function create(Request $request) {
        try {
            $auth = auth()->guard('api')->user();

            $levels = new UserLevel();
            $levels->id = Uuid::uuid4()->toString();
            $levels->name = $request->name;
            $levels->description = $request->description;
            $levels->created_by = $auth == null ? null : $auth->id;
            $levels->allow_delete = true;
            $levels->saveOrFail();

            $this->genPrivileges($levels, $auth);

            return $this->table(new Request(['id' => $levels->id]))->first();
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    private function genPrivileges(UserLevel $userLevel, $auth) {
        try {
            $menus = Menu::whereNull('parent')->orderBy('order', 'asc')->get();
            foreach ($menus as $menu) {
                $priv = new UserPrivilege();
                $priv->id = Uuid::uuid4()->toString();
                $priv->level = $userLevel->id;
                $priv->route = $menu->route;
                $priv->read = false; $priv->create = false; $priv->update = false; $priv->delete = false;
                $priv->created_by = $auth != null ? $auth->id : null ;
                $priv->saveOrFail();
                $childs = Menu::where('parent', $menu->id)->orderBy('order', 'asc')->get();
                foreach ($childs as $child) {
                    $privC = new UserPrivilege();
                    $privC->id = Uuid::uuid4()->toString();
                    $privC->level = $userLevel->id;
                    $privC->route = $child->route;
                    $privC->read = false; $privC->create = false; $privC->update = false; $privC->delete = false;
                    $privC->created_by = $auth != null ? $auth->id : null ;
                    $privC->saveOrFail();
                }
            }
            return $userLevel;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function table(Request $request) {
        try {
            $auth = auth()->guard('api')->user();

            $response = collect();
            $levels = UserLevel::orderBy('name', 'asc')->where('name','!=','guest');
            if (strlen($request->id) > 0) $levels = $levels->where('id', $request->id);
            if ($auth != null) {
                if (!$auth->levelObj->super) {
                    $levels = $levels->where('super', $auth->levelObj->super);
                }
            }
            $levels = $levels->get();

            foreach ($levels as $level) {
                $response->push((object)[
                    'value' => $level->id, 'label' => $level->name,
                    'meta' => (object) [
                        'delete' => $level->allow_delete,
                        'description' => strlen($level->description) == 0 ? '' : $level->description,
                        'privileges' => $this->privileges($level),
                    ]
                ]);
            }
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    private function privileges(UserLevel $userLevel) {
        try {
            $response = collect();
            $parents = Menu::whereNull('parent')->orderBy('order','asc')->get();
            foreach ($parents as $parent) {
                $priv = UserPrivilege::where('route', $parent->route)->where('level', $userLevel->id)->first();
                if ($priv != null) {
                    $dataChildrens = collect();
                    $childrens = Menu::where('parent', $parent->id)->get();
                    foreach ($childrens as $children) {
                        $privChild = UserPrivilege::where('route', $children->route)->where('level', $userLevel->id)->first();
                        if ($privChild != null) {
                            $dataChildrens->push((object)[
                                'value' => $privChild->id,
                                'label' => $children->name,
                                'meta' => (object) [
                                    'route' => $children->route,
                                    'url' => route($children->route),
                                    'icon' => $children->icon_fa,
                                    'privs' => (object) [
                                        'r' => $privChild->read,
                                        'c' => $privChild->create,
                                        'u' => $privChild->update,
                                        'd' => $privChild->delete,
                                    ]
                                ]
                            ]);
                        }
                    }
                    $response->push((object)[
                        'value' => $priv->id, 'label' => $parent->name,
                        'meta' => (object) [
                            'url' => route($parent->route),
                            'route' => $parent->route,
                            'icon' => $parent->icon_fa,
                            'privs' => (object) [
                                'r' => $priv->read, 'c' => $priv->create, 'u' => $priv->update, 'd' => $priv->delete
                            ],
                            'childrens' => $dataChildrens
                        ]
                    ]);
                }
            }
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
}
