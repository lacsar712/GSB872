<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Streak;
use App\Models\CheckIn;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class StreakController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $streak = Streak::getOrCreateForUser($user->id);

        $checkInDates = CheckIn::where('user_id', $user->id)
            ->select(DB::raw('DATE(created_at) as date'))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->pluck('date')
            ->map(fn ($d) => Carbon::parse($d)->toDateString())
            ->toArray();

        $today = Carbon::today()->toDateString();
        $checkedInToday = in_array($today, $checkInDates);

        return response()->json([
            'current_streak' => $streak->current_streak,
            'longest_streak' => $streak->longest_streak,
            'total_check_in_days' => $streak->total_check_in_days,
            'last_check_in_date' => $streak->last_check_in_date?->toDateString(),
            'checked_in_today' => $checkedInToday,
            'recent_dates' => $checkInDates,
        ]);
    }

    public function rankings()
    {
        $topStreaks = Streak::with('user')
            ->orderByDesc('current_streak')
            ->orderByDesc('longest_streak')
            ->take(20)
            ->get();

        return response()->json($topStreaks);
    }
}
