<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CheckIn;
use App\Models\Streak;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CheckInController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'book_name' => 'required|string',
            'chapters' => 'required|array',
            'comment' => 'nullable|string',
        ]);

        $checkIn = CheckIn::create([
            'user_id' => $request->user()->id,
            'book_name' => $request->book_name,
            'chapters' => $request->chapters,
            'comment' => $request->comment,
        ]);

        // Update streak: same-day duplicates won't increment thanks to Streak::registerCheckIn.
        $streak = Streak::firstOrCreate(['user_id' => $request->user()->id]);
        $streak->registerCheckIn(Carbon::now());

        return response()->json($checkIn, 201);
    }

    public function index()
    {
        // Today's check-ins with pagination
        return CheckIn::with('user')
            ->whereDate('created_at', Carbon::today())
            ->latest()
            ->paginate(20);
    }

    public function userHistory($userId)
    {
        return CheckIn::where('user_id', $userId)
            ->with('user')
            ->latest()
            ->paginate(20);
    }

    public function history(Request $request)
    {
        return CheckIn::where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }

    public function rankings()
    {
        // Simple ranking by count of check-ins this week
        $weeklyInfo = CheckIn::select('user_id', DB::raw('count(*) as total'))
            ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->with('user')
            ->take(10)
            ->get();
            
         $monthlyInfo = CheckIn::select('user_id', DB::raw('count(*) as total'))
            ->whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->with('user')
            ->take(10)
            ->get();

        return response()->json([
            'weekly' => $weeklyInfo,
            'monthly' => $monthlyInfo,
        ]);
    }
    
    public function search(Request $request)
    {
        $query = $request->input('q');
        if (empty($query)) {
            return [];
        }

        return CheckIn::with('user')
            ->where('book_name', 'like', "%{$query}%")
            ->orWhere('comment', 'like', "%{$query}%")
            ->orWhereHas('user', function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->latest()
            ->get();
    }

    public function like(Request $request, $id) 
    {
        $user = $request->user();
        $checkIn = CheckIn::findOrFail($id);

        return DB::transaction(function () use ($user, $checkIn) {
            $like = \App\Models\CheckInLike::where('user_id', $user->id)
                ->where('check_in_id', $checkIn->id)
                ->first();

            if ($like) {
                return response()->json([
                    'message' => '您已经点过赞了',
                    'likes_count' => $checkIn->likes_count
                ], 422);
            }

            \App\Models\CheckInLike::create([
                'user_id' => $user->id,
                'check_in_id' => $checkIn->id
            ]);

            $checkIn->increment('likes_count');

            return response()->json([
                'message' => '点赞成功',
                'likes_count' => $checkIn->likes_count
            ]);
        });
    }
}
