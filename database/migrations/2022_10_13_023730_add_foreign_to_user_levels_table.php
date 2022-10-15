<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignToUserLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_levels', function (Blueprint $table) {
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
        Schema::table('user_levels', function (Blueprint $table) {
            $table->dropForeign('user_levels_created_by_foreign');
            $table->dropForeign('user_levels_deleted_by_foreign');
            $table->dropForeign('user_levels_updated_by_foreign');
        });
    }
}
