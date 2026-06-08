<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:users',
            'avatar' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'avatar' => $request->avatar,
            'password' => Hash::make('123456'), // Default password or derived
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $user = User::where('name', $request->name)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'name' => ['用户不存在。'],
            ]);
        }

        // For this simple app, we might check password if provided, or just login by name if allowed
        // But rule says "Register login".
        // Assuming password is required implicitly or just login by name as prompt implies "Register name+avatar".
        // Let's assume login by name is sufficient or password "123456" is default.
        // I will just login by name for simplicity as it's a "Clock-in" app.
        
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }
}
