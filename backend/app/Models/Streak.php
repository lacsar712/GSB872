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
    ];

    protected $casts = [
        'last_check_in_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Register a check-in for the given date and update streak counters.
     * Multiple check-ins on the same calendar day will not increment the streak.
     */
    public function registerCheckIn(Carbon $date): void
    {
        $today = $date->copy()->startOfDay();
        $last = $this->last_check_in_date ? $this->last_check_in_date->copy()->startOfDay() : null;

        if ($last && $last->equalTo($today)) {
            // Same calendar day, do not increment.
            return;
        }

        if ($last && $last->copy()->addDay()->equalTo($today)) {
            $this->current_streak = $this->current_streak + 1;
        } else {
            $this->current_streak = 1;
        }

        if ($this->current_streak > $this->longest_streak) {
            $this->longest_streak = $this->current_streak;
        }

        $this->last_check_in_date = $today;
        $this->save();
    }
}
