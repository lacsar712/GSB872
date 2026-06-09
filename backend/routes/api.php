<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BibleController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\StreakController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/bible/books', [BibleController::class, 'books']);
    Route::get('/bible/daily_verse', [BibleController::class, 'dailyVerse']);
    
    Route::get('/checkins', [CheckInController::class, 'index']);
    Route::post('/checkins', [CheckInController::class, 'store']);
    Route::get('/checkins/history', [CheckInController::class, 'history']); // My history
    Route::get('/checkins/user/{id}', [CheckInController::class, 'userHistory']); // Specific user history
    Route::get('/checkins/rankings', [CheckInController::class, 'rankings']);
    Route::get('/checkins/search', [CheckInController::class, 'search']);
    Route::post('/checkins/{id}/like', [CheckInController::class, 'like']);

    Route::get('/streak', [StreakController::class, 'show']);
});
