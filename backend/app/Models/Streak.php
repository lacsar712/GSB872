<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Streak extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'current_streak',
        'longest_streak',
        'last_check_in_date',
        'total_check_in_days',
    ];

    protected $casts = [
        'last_check_in_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recordCheckIn(Carbon $checkInDate = null)
    {
        $checkInDate = $checkInDate ?: Carbon::today();
        $today = $checkInDate->toDateString();
        $yesterday = $checkInDate->copy()->subDay()->toDateString();

        if ($this->last_check_in_date && $this->last_check_in_date->toDateString() === $today) {
            return $this;
        }

        if ($this->last_check_in_date && $this->last_check_in_date->toDateString() === $yesterday) {
            $this->current_streak += 1;
        } else {
            $this->current_streak = 1;
        }

        $this->last_check_in_date = $today;
        $this->total_check_in_days += 1;

        if ($this->current_streak > $this->longest_streak) {
            $this->longest_streak = $this->current_streak;
        }

        $this->save();

        return $this;
    }

    public static function getOrCreateForUser(int $userId): self
    {
        return self::firstOrCreate(
            ['user_id' => $userId],
            [
                'current_streak' => 0,
                'longest_streak' => 0,
                'total_check_in_days' => 0,
            ]
        );
    }
}
