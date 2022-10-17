<?php


namespace App\Repositories\User;


use App\Models\Menu;
use App\Models\UserPrivilege;
use Illuminate\Http\Request;

class UserPrivilegeRepository
{
    public function update(Request $request) {
        try {
            $user = auth()->guard('api')->user();
            $privileges = UserPrivilege::where('id', $request->privilege)->first();
            $menu = Menu::where('route', $privileges->route)->first();
            switch ($request->type){
                case 'r' :
                    $privileges->read = $request->checked == 0 ? false : true;
                    if (!$privileges->read) {
                        $privileges->create = false;
                        $privileges->update = false;
                        $privileges->delete = false;
                        if ($menu != null) {
                            if (strlen($menu->parent) == 0) {
                                $childrens = Menu::where('parent', $menu->id)->get();
                                foreach ($childrens as $children) {
                                    $priv = UserPrivilege::where('level', $request->level)->where('route', $children->route)->first();
                                    if ($priv != null) {
                                        $priv->read = false;
                                        $priv->create = false;
                                        $priv->update = false;
                                        $priv->delete = false;
                                        $priv->saveOrFail();
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 'c' :
                    $privileges->create = $request->checked == 0 ? false : true;
                    if (!$privileges->create) {
                        $privileges->update = false;
                        $privileges->delete = false;
                    }
                    break;
                case 'u' :
                    $privileges->update = $request->checked == 0 ? false : true;
                    if (!$privileges->update) {
                        $privileges->delete = false;
                    }
                    break;
                case 'd' : $privileges->delete = $request->checked == 0 ? false : true; break;
            }
            $privileges->updated_by = $user->id;
            $privileges->saveOrFail();

            $repoLevel = new UserLevelRepository();
            return $repoLevel->table(new Request(['id' => $request->level]))->first();
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
}
