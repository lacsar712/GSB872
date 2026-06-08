<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BibleBook;
use App\Models\DailyVerse;
use Carbon\Carbon;

class BibleController extends Controller
{
    public function books()
    {
        return BibleBook::all();
    }

    public function dailyVerse()
    {
        $today = Carbon::today()->toDateString();
        $verse = DailyVerse::where('for_date', $today)->first();

        if (!$verse) {
            // Try to find a verse without a date to assign to today
            // Or just pick a random one if we want to allow repeats after some time
            // For now, let's pick a random one that hasn't been used recently or just any random one
            $randomVerse = DailyVerse::whereNull('for_date')->inRandomOrder()->first();
            
            if (!$randomVerse) {
                // If all have dates, just pick any random one to duplicate for today
                $randomVerse = DailyVerse::inRandomOrder()->first();
            }

            if ($randomVerse) {
                $verse = DailyVerse::create([
                    'content' => $randomVerse->content,
                    'reference' => $randomVerse->reference,
                    'for_date' => $today
                ]);
            } else {
                 // Absolute fallback if table is empty
                 $verse = DailyVerse::create([
                    'content' => '起初，神创造天地。',
                    'reference' => '创世记 1:1',
                    'for_date' => $today
                 ]);
            }
        }

        return response()->json($verse);
    }
}
