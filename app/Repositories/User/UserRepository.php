<?php


namespace App\Repositories\User;


use App\Models\User;
use Illuminate\Http\Request;

class UserRepository
{
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
