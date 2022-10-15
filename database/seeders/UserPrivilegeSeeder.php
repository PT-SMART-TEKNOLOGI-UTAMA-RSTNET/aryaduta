<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\UserLevel;
use App\Models\UserPrivilege;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Uuid;

class UserPrivilegeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $levels = UserLevel::all();
        $menus = Menu::all();
        $this->command->getOutput()->progressStart($levels->count());
        foreach ($levels as $level) {
            foreach ($menus as $menu) {
                $dataMenu = UserPrivilege::where('level', $level->id)->where('route', $menu->route)->first();
                if ($dataMenu == null) {
                    $dataMenu = new UserPrivilege();
                    $dataMenu->id = Uuid::uuid4()->toString();
                    $dataMenu->level = $level->id;
                    $dataMenu->route = $menu->route;
                    if ($level->super) {
                        $dataMenu->read = true;
                        $dataMenu->create = true;
                        $dataMenu->update = true;
                        $dataMenu->delete = true;
                    } else {
                        $dataMenu->read = false;
                        $dataMenu->create = false;
                        $dataMenu->update = false;
                        $dataMenu->delete = false;
                    }
                    $dataMenu->saveOrFail();
                }
            }
            $this->command->getOutput()->progressAdvance();
        }
        $this->command->getOutput()->progressFinish();
    }
}
