<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'error' => false,
        'message' => 'Laravel API is running',
        'data' => null,
    ]);
});
