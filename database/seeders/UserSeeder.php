<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserLevel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Ramsey\Uuid\Uuid;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $levelAdmin = UserLevel::where('name', 'administrator')->first();
        $levelDefault = UserLevel::where('name', 'default')->first();

        $dumps = collect();

        if ($levelAdmin != null) {
            $dumps->push((object)[
                'level' => $levelAdmin->id, 'type' => 'users', 'name' => 'Administrator',
                'email' => 'admin@aryaduta.com', 'password' => Hash::make('D13R&6##!((DD'),
                'system' => true
            ]);
        }
        if ($levelDefault != null) {
            $dumps->push((object)[
                'level' => $levelDefault->id, 'type' => 'system', 'name' => 'notification',
                'email' => 'notification@aryaduta.com', 'password' => Hash::make("D13R&6##!((DD"),
                'system' => true
            ]);
        }
        if ($dumps->count() > 0) {
            $this->command->getOutput()->progressStart($dumps->count());
            foreach ($dumps as $dump) {
                $user = User::where('email', $dump->email)->first();
                if ($user == null) {
                    $user = new User();
                    $user->id = Uuid::uuid4()->toString();
                    $user->name = $dump->name;
                    $user->email = $dump->email;
                    $user->level = $dump->level;
                    $user->password = $dump->password;
                }
                $user->system = $dump->system;
                $user->saveOrFail();
                $this->command->getOutput()->progressAdvance();
            }
            $this->command->getOutput()->progressFinish();
        }
    }
}
