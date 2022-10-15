<?php

namespace Database\Seeders;

use App\Models\UserLevel;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Uuid;

class UserLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dumps = collect();
        $dumps->push((object)[
            'name' => 'default', 'description' => null, 'allow_delete' => false, 'super' => true
        ]);
        $dumps->push((object)[
            'name' => 'guest', 'description' => null, 'allow_delete' => false, 'super' => false
        ]);
        $dumps->push((object)[
            'name' => 'administrator', 'description' => null, 'allow_delete' => false, 'super' => true
        ]);
        $this->command->getOutput()->progressStart($dumps->count());
        foreach ($dumps as $dump) {
            $level = UserLevel::where('name', $dump->name)->first();
            if ($level == null) {
                $level = new UserLevel();
                $level->id = Uuid::uuid4()->toString();
            }
            $level->name = $dump->name;
            $level->super = $dump->super;
            $level->allow_delete = $dump->allow_delete;
            $level->description = $dump->description;
            $level->saveOrFail();
            $this->command->getOutput()->progressAdvance();
        }
        $this->command->getOutput()->progressFinish();
    }
}
