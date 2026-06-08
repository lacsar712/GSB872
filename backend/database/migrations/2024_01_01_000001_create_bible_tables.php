<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bible_books', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Genesis"
            $table->integer('chapter_count'); // Total chapters
            $table->timestamps();
        });

        Schema::create('daily_verses', function (Blueprint $table) {
            $table->id();
            $table->text('content'); // The verse text
            $table->string('reference'); // e.g., "Psalm 23:1"
            $table->date('for_date')->unique(); // Verse for specific date
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_verses');
        Schema::dropIfExists('bible_books');
    }
};
