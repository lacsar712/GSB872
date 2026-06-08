<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('check_in_streaks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('check_in_date');
            $table->integer('current_streak')->default(1);
            $table->timestamps();
            
            $table->unique(['user_id', 'check_in_date']);
            $table->index(['user_id', 'check_in_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('check_in_streaks');
    }
};
