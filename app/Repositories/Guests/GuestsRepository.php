<?php


namespace App\Repositories\Guests;
use App\Models\UserLevel;
use Illuminate\Http\Request;
use App\Models\User;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GuestsRepository
{
    public function createGuests(Request $request){
        try{
            $guests = new User();
            $user = auth()->guard('api')->user();
            $guests->id = Uuid::uuid4()->toString();
            $guests->name = $request->name;
            $guests->email = $request->email;
            $password = Str::random(8);
            $guests->password = Hash::make($password);
            $guests->phone = $request->phone;
            $guests->address_1 = $request->alamat;
            $guests->type = 'guests';

            $level = UserLevel::where('name', 'guest')->first();
            $guests->level = $level->id;
            $guests->created_by = $user->id;

            $guests->saveOrFail();
            return $this->table(new Request(['id' => $user->id]));
        } catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 500);
        }
    }

    public function updateGuests(Request $request){
        try{
            $guests = User::where('id', $request->id)->first();
            $user = auth()->guard('api')->user();
            $guests->name = $request->name;
            $guests->email = $request->email;
            $guests->phone = $request->phone;
            $guests->address_1 = $request->alamat;
            $guests->type = 'guests';

            $level = UserLevel::where('name', 'guest')->first();
            $guests->level = $level->id;
            $guests->updated_by = $user->id;

            $guests->saveOrFail();
            return $this->table(new Request());
        }catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 500);
        }
    }

    public function deleteGuests($request){
        try{
            User::whereIn('id',$request->id)->delete();
            return true;
        }catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 500);
        }
    }

    public function table(Request $request){
        try{
            $response = collect([]);

            $guests = User::orderBy('name','asc')->where('type','guests');
            if (strlen($request->id) > 0) $guests = $guests->where('id', $request->id);
            $guests = $guests->get();
            foreach ($guests as $guest){
                $response->push([
                   'value' => $guest->id,
                   'label' => $guest->name,
                   'meta' => [
                       'email' => $guest->email,
                       'phone' => $guest->phone,
                       'address' => $guest->address_1,
                       'type' => $guest->type,
                       'level' => $guest->levelObj,
                   ],
                ]);
            }

            return $response;
        }catch (\Exception $exception) {
            throw new \Exception($exception->getMessage(), 500);
        }
    }

}
