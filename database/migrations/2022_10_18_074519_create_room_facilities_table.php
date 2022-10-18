<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomFacilitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('room_facilities', function (Blueprint $table) {
            $table->uuid('id')->primary()->unique();
            $table->uuid('room');
            $table->uuid('item');
            $table->uuid('install_by')->nullable();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->uuid('deleted_by')->nullable();
            $table->dateTime('install_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('room')->on('rooms')->references('id')->onDelete('cascade')->onUpdate('no action');
            $table->foreign('item')->on('items')->references('id')->onDelete('cascade')->onUpdate('no action');
            $table->foreign('install_by')->on('users')->references('id')->onDelete('set null')->onUpdate('no action');
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
        Schema::dropIfExists('room_facilities');
    }
}
