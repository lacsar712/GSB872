<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BibleBook;
use App\Models\DailyVerse;
use Carbon\Carbon;

class BibleBookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            ['name' => '创世记', 'chapter_count' => 50],
            ['name' => '出埃及记', 'chapter_count' => 40],
            ['name' => '利未记', 'chapter_count' => 27],
            // ... Simplified for demo
            ['name' => '马太福音', 'chapter_count' => 28],
            ['name' => '马可福音', 'chapter_count' => 16],
            ['name' => '路加福音', 'chapter_count' => 24],
            ['name' => '约翰福音', 'chapter_count' => 21],
            ['name' => '启示录', 'chapter_count' => 22],
        ];

        foreach ($books as $book) {
            BibleBook::firstOrCreate($book);
        }

        // Seed some daily verses
        DailyVerse::firstOrCreate([
            'for_date' => Carbon::today()->toDateString(),
        ], [
            'content' => '起初，神创造天地。',
            'reference' => '创世记 1:1'
        ]);
    }
}
