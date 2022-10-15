<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Uuid;

class MenuSeeder extends Seeder
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
            'route' => 'rooms', 'name' => 'Room', 'locale_id' => 'aryaduta_rooms.room', 'description' => null, 'icon' => 'fa fa-bed',
            'childrens' => collect([
                (object)[
                    'route' => 'rooms.reservations', 'name' => 'Reservasi', 'locale_id' => 'aryaduta_rooms.reservation',
                    'description' => null, 'icon' => 'fa fa-book'
                ],
                (object)[
                    'route' => 'rooms.usages', 'name' => 'Room Usage', 'locale_id' => 'aryaduta_rooms.usages',
                    'description' => null, 'icon' => 'fa fa-book-open'
                ]
            ])
        ]);
        $dumps->push((object)[
            'route' => 'guests', 'name' => 'Guest', 'locale_id' => 'aryaduta_rooms.room', 'description' => null, 'icon' => 'fa fa-user-tie',
            'childrens' => collect()
        ]);
        $dumps->push((object)[
            'route' => 'users', 'name' => 'Users', 'locale_id' => 'aryaduta_users.user', 'description' => null, 'icon' => 'fa fa-user-friends',
            'childrens' => collect([
                (object)[
                    'route' => 'users.levels', 'name' => 'User Level', 'locale_id' => 'aryaduta_users.level',
                    'description' => null, 'icon' => 'fa fa-user-secret',
                ],
                (object)[
                    'route' => 'users.privileges', 'name' => 'User Privilege', 'locale_id' => 'aryaduta_users.privileges',
                    'description' => null, 'icon' => 'fa fa-user-shield'
                ]
            ])
        ]);

        $notDeletes = collect();
        $this->command->getOutput()->progressStart($dumps->count());
        foreach ($dumps as $indexDump => $dump) {
            $menu = Menu::where('route', $dump->route)->first();
            if ($menu == null) {
                $menu = new Menu();
                $menu->id = Uuid::uuid4()->toString();
                $menu->route = $dump->route;
            }
            $menu->order = $indexDump;
            $menu->name = $dump->name;
            $menu->icon_fa = $dump->icon;
            $menu->locale_id = $dump->locale_id;
            $menu->description = $dump->description;
            $menu->saveOrFail();
            $notDeletes->push($menu->id);
            foreach ($dump->childrens as $indexChildren => $children) {
                $childMenu = Menu::where('route', $children->route)->first();
                if ($childMenu == null) {
                    $childMenu = new Menu();
                    $childMenu->id = Uuid::uuid4()->toString();
                    $childMenu->route = $children->route;
                }
                $childMenu->order = $indexChildren;
                $childMenu->parent = $menu->id;
                $childMenu->name = $children->name;
                $childMenu->icon_fa = $children->icon;
                $childMenu->locale_id = $children->locale_id;
                $childMenu->description = $children->description;
                $childMenu->saveOrFail();
                $notDeletes->push($childMenu->id);
            }
            $this->command->getOutput()->progressAdvance();
        }
        $this->command->getOutput()->progressFinish();

        Menu::whereNotIn('id', $notDeletes)->delete();
    }
}
