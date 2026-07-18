<?php

namespace App\Http\Controllers;

use App\Traits\HasApiResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller
{
    use HasApiResponse, AuthorizesRequests;
}
