<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary()->unique();
            $table->uuid('level');
            $table->string('type',40)->default('users');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone',30)->nullable();
            $table->string('address_1')->nullable();
            $table->string('address_2')->nullable();
            $table->bigInteger('province')->nullable();
            $table->bigInteger('city')->nullable();
            $table->bigInteger('district')->nullable();
            $table->bigInteger('village')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->boolean('system')->default(false);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->uuid('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('level')->on('user_levels')->references('id')->onDelete('cascade')->onUpdate('no action');
            $table->foreign('province')->on(config('laravolt.indonesia.table_prefix') . 'provinces')->references('id')->onDelete('set null')->onUpdate('no action');
            $table->foreign('district')->on(config('laravolt.indonesia.table_prefix') . 'districts')->references('id')->onDelete('set null')->onUpdate('no action');
            $table->foreign('city')->on(config('laravolt.indonesia.table_prefix') . 'cities')->references('id')->onDelete('set null')->onUpdate('no action');
            $table->foreign('village')->on(config('laravolt.indonesia.table_prefix') . 'villages')->references('id')->onDelete('set null')->onUpdate('no action');
        });

        Schema::table('users', function (Blueprint $table){
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
        Schema::dropIfExists('users');
    }
}
