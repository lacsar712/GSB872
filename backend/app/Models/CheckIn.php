<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckIn extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'book_name', 'chapters', 'comment', 'likes_count'];

    protected $casts = [
        'chapters' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
