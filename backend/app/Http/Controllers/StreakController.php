<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Streak;
use Illuminate\Support\Carbon;

class StreakController extends Controller
{
    /**
     * Return the authenticated user's streak summary.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $streak = Streak::firstOrCreate(['user_id' => $user->id]);

        // If the user missed a day, the current streak should reset to 0 once viewed.
        $today = Carbon::today();
        if ($streak->last_check_in_date) {
            $diff = $streak->last_check_in_date->copy()->startOfDay()->diffInDays($today, false);
            if ($diff > 1) {
                $streak->current_streak = 0;
                $streak->save();
            }
        }

        return response()->json([
            'current_streak' => $streak->current_streak,
            'longest_streak' => $streak->longest_streak,
            'last_check_in_date' => $streak->last_check_in_date?->toDateString(),
            'checked_in_today' => $streak->last_check_in_date
                ? $streak->last_check_in_date->isSameDay($today)
                : false,
        ]);
    }
}
