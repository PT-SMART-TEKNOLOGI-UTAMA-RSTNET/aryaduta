<?php


namespace App\Repositories\User;


use App\Models\Menu;
use App\Models\UserLevel;
use App\Models\UserPrivilege;
use Illuminate\Http\Request;

class UserLevelRepository
{
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
                    if ($priv->read) {
                        $dataChildrens = collect();
                        $childrens = Menu::where('parent', $parent->id)->get();
                        foreach ($childrens as $children) {
                            $privChild = UserPrivilege::where('route', $children->route)->where('level', $userLevel->id)->first();
                            if ($privChild != null) {
                                if ($privChild->read) {
                                    $dataChildrens->push((object)[
                                        'value' => $children->id,
                                        'label' => $children->name,
                                        'meta' => (object) [
                                            'route' => $children->route,
                                            'url' => route($children->route),
                                            'icon' => $children->icon,
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
                        }
                        $response->push((object)[
                            'value' => $parent->id, 'label' => $parent->name,
                            'meta' => (object) [
                                'url' => route($parent->route),
                                'route' => $parent->route,
                                'privs' => (object) [
                                    'r' => $priv->read, 'c' => $priv->create, 'u' => $priv->update, 'd' => $priv->delete
                                ],
                                'childrens' => $dataChildrens
                            ]
                        ]);
                    }
                }
            }
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
}
