<?php


namespace App\Repositories\User;


use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Ramsey\Uuid\Uuid;

class UserRepository
{
    public function create(Request $request) {
        try {
            $auth = auth()->guard('api')->user();
            $user = new User();
            $user->id = Uuid::uuid4()->toString();
            $user->name = $request->name;
            $user->level = $request->level;
            $user->type = 'users';
            $user->email = $request->email;
            $user->password = strlen($request->password) == 0 ? Hash::make($request->email) : Hash::make($request->password);
            $user->system = false;
            $user->created_by = $auth == null ? null : $auth->id;
            $user->saveOrFail();
            return $this->table(new Request(['id' => $user->id]));
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function update(Request $request) {
        try {
            $auth = auth()->guard('api')->user();
            $user = User::where('id', $request->id)->first();
            $user->name = $request->name;
            $user->level = $request->level;
            $user->email = $request->email;
            if (strlen($request->password) > 0) {
                $user->password = Hash::make($request->password);
            }
            $user->updated_by = $auth == null ? null : $auth->id;
            $user->saveOrFail();

            return $this->table(new Request(['id' => $user->id]));
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function delete(Request $request) {
        try {
            User::whereIn('id', $request->id)->delete();
            return true;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
    public function table(Request $request) {
        try {
            $response = collect();
            $users = User::orderBy('name', 'asc')->where('type', 'users')->where('system', false);
            if (strlen($request->id) > 0) $users = $users->where('id', $request->id);
            $users = $users->get();
            foreach ($users as $user) {
                $response->push((object)[
                    'value' => $user->id, 'label' => $user->name,
                    'meta' => (object) [
                        'email' => $user->email,
                        'level' => (object) [
                            'value' => $user->levelObj->id,
                            'label' => $user->levelObj->name
                        ],
                        'verify' => (object) [
                            'at' => $user->email_verified_at,
                            'status' => $user->email_verified_at == null ? false : true
                        ]
                    ]
                ]);
            }
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(),500);
        }
    }
}
