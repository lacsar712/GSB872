<?php
 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckInLike extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'check_in_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function checkIn()
    {
        return $this->belongsTo(CheckIn::class);
    }
}
