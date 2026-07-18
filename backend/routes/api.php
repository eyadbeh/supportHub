<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'success' => true,
    'message' => 'SupportHub API is running.',
    'data' => [
        'version' => '1.0.0',
        'environment' => app()->environment(),
    ],
]));
