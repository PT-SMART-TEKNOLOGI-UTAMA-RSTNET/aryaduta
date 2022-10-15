<?php


namespace App\Repositories\Auth;


use App\Models\Menu;
use App\Models\User;
use App\Models\UserLevel;
use App\Models\UserPrivilege;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Lang;
use Laravel\Passport\Passport;
use Ramsey\Uuid\Uuid;

class AuhtRepository
{
    public function table(Request $request) {
        try {
            $response = collect();
            $users = User::orderBy('name', 'asc')->where('system', false);
            if (strlen($request->id) > 0) $users = $users->where('id', $request->id);
            if (strlen($request->level) > 0) $users = $users->where('level', $request->level);

            $users = $users->get();
            foreach ($users as $user) {
                $response->push((object)[
                    'value' => $user->id, 'label' => $user->name,
                    'meta' => (object) [
                        'address' => (object) [
                            'street_1' => $user->address_1,
                            'street_2' => $user->address_2,
                            'phone' => $user->phone,
                            'email' => $user->email
                        ]
                    ]
                ]);
            }
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function register(Request $request) {
        try {
            $guestLevel = UserLevel::where('name', 'guest')->first();
            if ($guestLevel == null) throw new \Exception('Unexpected error, please contact administrator',400);

            $user = new User();
            $user->id = Uuid::uuid4()->toString();
            $user->level = $guestLevel->id;
            $user->type = 'guests';
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->system = false;
            $user->saveOrFail();
            return $this->table(new Request(['id' => $user->id]))->first();
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function firebaseLogin(Request $request) {
        try {
            return $this->login(new Request(['username' => $request->email]));
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function login(Request $request) {
        try {
            $user = User::where('email', $request->username)->first();
            //if (strlen($user->email_verified_at) == 0) throw new \Exception(Lang::get('aryaduta_users.verify_email'),403);
            auth()->login($user);
            DB::table("oauth_access_tokens")->where('user_id', $user->id)->delete();
            Passport::tokensExpireIn(Carbon::now()->addHours(2));
            Passport::refreshTokensExpireIn(Carbon::now()->addHours(3));
            $objToken = auth()->user()->createToken($user->type);
            $token = $objToken->accessToken;
            $response = (object)[
                'token' => (object)[
                    'token_type' => 'Bearer',
                    'expired_in' => $objToken->token->expires_at->diffInSeconds(Carbon::now()),
                    'expired_date' => $objToken->token->expires_at->format('Y-m-d H:i:s'),
                    'string' => $token
                ],
                'user' => $this->getUser(new Request(['email' => $user->email ]))
            ];
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    private function levelObj(User $user){
        try {
            $response = null;
            $level = UserLevel::where('id', $user->level)->first();
            if ($level != null) {
                $response = (object)[
                    'value' => $level->id,
                    'label' => $level->name,
                    'meta' => (object) [
                        'super' => $level->super,
                        'allow_delete' => $level->allow_delete,
                        'menus' => collect()
                    ]
                ];
                $menuParents = Menu::orderBy('order', 'asc')->whereNull('parent')->get();
                foreach ($menuParents as $menuParent) {
                    $priv = UserPrivilege::where('level', $level->id)->where('route', $menuParent->route)->first();
                    if ($priv != null) {
                        if ($priv->read) {
                            $menuData = (object)[
                                'value' => $menuParent->id,
                                'label' => $menuParent->name,
                                'meta' => (object) [
                                    'url' => route($menuParent->route),
                                    'route' => $menuParent->route,
                                    'locale_id' => $menuParent->locale_id,
                                    'icon' => $menuParent->icon_fa,
                                    'privs' => (object)[
                                        'c' => $priv->create,
                                        'u' => $priv->update,
                                        'd' => $priv->delete,
                                    ],
                                    'childrens' => collect()
                                ]
                            ];
                            $menuChildrens = Menu::where('parent', $menuParent->id)->orderBy('order', 'asc')->get();
                            foreach ($menuChildrens as $menuChildren) {
                                $privChildren = UserPrivilege::where('level', $level->id)->where('route', $menuChildren->route)->first();
                                if ($privChildren != null) {
                                    if ($privChildren->read) {
                                        $menuChildrenData = (object)[
                                            'value' => $menuChildren->id,
                                            'label' => $menuChildren->name,
                                            'meta' => (object) [
                                                'url' => route($menuChildren->route),
                                                'route' => $menuChildren->route,
                                                'locale_id' => $menuChildren->locale_id,
                                                'icon' => $menuChildren->icon_fa,
                                                'privs' => (object)[
                                                    'c' => $privChildren->create,
                                                    'u' => $privChildren->update,
                                                    'd' => $privChildren->delete,
                                                ],
                                                'childrens' => collect(),
                                            ]
                                        ];
                                        //dd($menuData);
                                        $menuData->meta->childrens->push($menuChildrenData);
                                    }
                                }
                            }
                            //dd($response, $menuData);
                            $response->meta->menus->push($menuData);
                        }
                    }
                }
            }
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function getUser(Request $request){
        try {
            $user = User::where('email', $request->email)->first();
            return (object)[
                'value' => $user->id,
                'label' => $user->name,
                'meta' => (object) [
                    'level' => $this->levelObj($user),
                    'email' => (object)[
                        'address' => $user->email,
                        'verify' => (object) [
                            'at' => $user->email_verified_at,
                            'status' => $user->email_verified_at == null ? false : true
                        ]
                    ],
                    'type' => $user->type,
                    'phone' => $user->phone,
                ]
            ];
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
}
