<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('x_user_id')->nullable()->unique()->after('avatar');
            $table->text('x_access_token')->nullable()->after('x_user_id');
            $table->text('x_refresh_token')->nullable()->after('x_access_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['x_user_id', 'x_access_token', 'x_refresh_token']);
        });
    }
};
