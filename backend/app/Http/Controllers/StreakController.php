<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Streak;
use Illuminate\Support\Carbon;

class StreakController extends Controller
{
    public function show(Request $request)
    {
        $streak = $this->getOrCreateStreak($request->user()->id);

        $this->checkAndResetIfBroken($streak);

        return response()->json([
            'current_streak' => $streak->current_streak,
            'longest_streak' => $streak->longest_streak,
            'last_check_in_date' => $streak->last_check_in_date?->toDateString(),
            'checked_in_today' => $streak->last_check_in_date?->isToday() ?? false,
        ]);
    }

    public function checkIn(Request $request)
    {
        $streak = $this->getOrCreateStreak($request->user()->id);

        $this->checkAndResetIfBroken($streak);

        if ($streak->last_check_in_date && $streak->last_check_in_date->isToday()) {
            return response()->json([
                'message' => '今日已打卡，不可重复累加',
                'current_streak' => $streak->current_streak,
                'longest_streak' => $streak->longest_streak,
                'last_check_in_date' => $streak->last_check_in_date->toDateString(),
                'checked_in_today' => true,
            ], 422);
        }

        $yesterday = Carbon::yesterday()->toDateString();

        if ($streak->last_check_in_date && $streak->last_check_in_date->toDateString() === $yesterday) {
            $streak->current_streak += 1;
        } else {
            $streak->current_streak = 1;
        }

        $streak->last_check_in_date = Carbon::today();

        if ($streak->current_streak > $streak->longest_streak) {
            $streak->longest_streak = $streak->current_streak;
        }

        $streak->save();

        return response()->json([
            'message' => '打卡成功',
            'current_streak' => $streak->current_streak,
            'longest_streak' => $streak->longest_streak,
            'last_check_in_date' => $streak->last_check_in_date->toDateString(),
            'checked_in_today' => true,
        ]);
    }

    private function getOrCreateStreak(int $userId): Streak
    {
        return Streak::firstOrCreate(
            ['user_id' => $userId],
            ['current_streak' => 0, 'longest_streak' => 0]
        );
    }

    private function checkAndResetIfBroken(Streak $streak): void
    {
        if ($streak->last_check_in_date && !$streak->last_check_in_date->isToday() && !$streak->last_check_in_date->isYesterday()) {
            $streak->current_streak = 0;
            $streak->save();
        }
    }
}
