<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Laravolt\Indonesia\Models\Province;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        if (Province::all()->count() == 0) {
            Artisan::call('laravolt:indonesia:seed');
        }
        $this->call([
            MenuSeeder::class,
            UserLevelSeeder::class,
            UserPrivilegeSeeder::class,
            UserSeeder::class,
        ]);
        // \App\Models\User::factory(10)->create();
    }
}
