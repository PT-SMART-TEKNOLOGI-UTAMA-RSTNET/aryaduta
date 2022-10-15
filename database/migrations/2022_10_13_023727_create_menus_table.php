<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->uuid('id')->primary()->unique();
            $table->uuid('parent')->nullable();
            $table->integer('order')->default(0);
            $table->string('route')->unique();
            $table->string('name');
            $table->string('icon_fa')->default('fa-home')->nullable();
            $table->string('locale_id')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });
        Schema::table('menus', function (Blueprint $table){
            $table->foreign('parent')->on('menus')->references('id')->onDelete('cascade')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('menus');
    }
}
