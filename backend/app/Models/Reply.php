<?php

namespace App\Models;

use Database\Factories\ReplyFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reply extends Model
{
    /** @use HasFactory<ReplyFactory> */
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'message',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class)->withTrashed();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }
}
