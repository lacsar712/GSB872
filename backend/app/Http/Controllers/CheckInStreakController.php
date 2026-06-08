<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CheckInStreak;
use Illuminate\Support\Carbon;

class CheckInStreakController extends Controller
{
    public function getStatus(Request $request)
    {
        $userId = $request->user()->id;
        
        $currentStreak = CheckInStreak::getCurrentStreak($userId);
        $longestStreak = CheckInStreak::getLongestStreak($userId);
        $totalDays = CheckInStreak::getTotalCheckInDays($userId);
        $hasCheckedInToday = CheckInStreak::hasCheckedInToday($userId);
        
        $year = Carbon::now()->year;
        $month = Carbon::now()->month;
        $monthlyCheckIns = CheckInStreak::getMonthlyCheckIns($userId, $year, $month);
        
        return response()->json([
            'current_streak' => $currentStreak,
            'longest_streak' => $longestStreak,
            'total_days' => $totalDays,
            'has_checked_in_today' => $hasCheckedInToday,
            'monthly_check_ins' => $monthlyCheckIns,
            'year' => $year,
            'month' => $month,
        ]);
    }

    public function checkIn(Request $request)
    {
        $userId = $request->user()->id;
        
        if (CheckInStreak::hasCheckedInToday($userId)) {
            return response()->json([
                'message' => '今日已打卡',
                'current_streak' => CheckInStreak::getCurrentStreak($userId),
                'has_checked_in_today' => true,
            ], 422);
        }
        
        $streak = CheckInStreak::recordCheckIn($userId);
        
        return response()->json([
            'message' => '打卡成功',
            'current_streak' => $streak->current_streak,
            'has_checked_in_today' => true,
            'check_in_date' => $streak->check_in_date,
        ], 201);
    }

    public function getMonthly(Request $request)
    {
        $userId = $request->user()->id;
        $year = $request->input('year', Carbon::now()->year);
        $month = $request->input('month', Carbon::now()->month);
        
        $checkIns = CheckInStreak::getMonthlyCheckIns($userId, $year, $month);
        
        return response()->json([
            'year' => $year,
            'month' => $month,
            'check_in_days' => $checkIns,
        ]);
    }

    public function getUserStreak($userId)
    {
        $currentStreak = CheckInStreak::getCurrentStreak($userId);
        $longestStreak = CheckInStreak::getLongestStreak($userId);
        $totalDays = CheckInStreak::getTotalCheckInDays($userId);
        
        return response()->json([
            'user_id' => $userId,
            'current_streak' => $currentStreak,
            'longest_streak' => $longestStreak,
            'total_days' => $totalDays,
        ]);
    }
}
