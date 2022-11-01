<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary()->unique();
            $table->string('number');
            $table->string('name');
            $table->integer('floor',false,true)->default(1);
            $table->integer('capacity',false,true)->default(1);
            $table->double('price_min',20,2,true)->default(0);
            $table->double('price',20,2,true)->default(0);
            $table->boolean('maintenance')->default(false);
            $table->boolean('cleaning')->default(false);
            $table->text('description')->nullable();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->uuid('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by')->on('users')->references('id')->onDelete('set null')->onUpdate('no action');
            $table->foreign('updated_by')->on('users')->references('id')->onDelete('set null')->onUpdate('no action');
            $table->foreign('deleted_by')->on('users')->references('id')->onDelete('set null')->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rooms');
    }
}
