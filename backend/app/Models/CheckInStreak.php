<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CheckInStreak extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'check_in_date', 'current_streak'];

    protected $casts = [
        'check_in_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function recordCheckIn($userId)
    {
        $today = Carbon::today()->toDateString();
        
        $existing = static::where('user_id', $userId)
            ->where('check_in_date', $today)
            ->first();
            
        if ($existing) {
            return $existing;
        }

        $yesterday = Carbon::yesterday()->toDateString();
        $yesterdayStreak = static::where('user_id', $userId)
            ->where('check_in_date', $yesterday)
            ->first();

        $currentStreak = $yesterdayStreak ? $yesterdayStreak->current_streak + 1 : 1;

        return static::create([
            'user_id' => $userId,
            'check_in_date' => $today,
            'current_streak' => $currentStreak,
        ]);
    }

    public static function getCurrentStreak($userId)
    {
        $today = Carbon::today();
        $latest = static::where('user_id', $userId)
            ->orderBy('check_in_date', 'desc')
            ->first();

        if (!$latest) {
            return 0;
        }

        $latestDate = Carbon::parse($latest->check_in_date);
        
        if ($latestDate->lt($today->copy()->subDay())) {
            return 0;
        }

        return $latest->current_streak;
    }

    public static function getLongestStreak($userId)
    {
        $maxStreak = static::where('user_id', $userId)
            ->max('current_streak');
            
        return $maxStreak ?? 0;
    }

    public static function getTotalCheckInDays($userId)
    {
        return static::where('user_id', $userId)->count();
    }

    public static function getMonthlyCheckIns($userId, $year = null, $month = null)
    {
        $year = $year ?? Carbon::now()->year;
        $month = $month ?? Carbon::now()->month;
        
        return static::where('user_id', $userId)
            ->whereYear('check_in_date', $year)
            ->whereMonth('check_in_date', $month)
            ->orderBy('check_in_date')
            ->get()
            ->pluck('check_in_date')
            ->map(fn($date) => Carbon::parse($date)->day);
    }

    public static function hasCheckedInToday($userId)
    {
        return static::where('user_id', $userId)
            ->whereDate('check_in_date', Carbon::today())
            ->exists();
    }
}
