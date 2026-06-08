<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('check_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('book_name');
            $table->json('chapters'); // Store as JSON array [1, 2, 3]
            $table->text('comment')->nullable();
            $table->integer('likes_count')->default(0);
            $table->timestamps();
        });

        Schema::create('check_in_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('check_in_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'check_in_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('check_in_likes');
        Schema::dropIfExists('check_ins');
    }
};
