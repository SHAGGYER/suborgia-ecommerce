<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function init(Request $request)
    {
        $user = null;

        if (auth()->guard("sanctum")->check()) {
            $user = auth()->guard("sanctum")->user();
        }

        return [
            "user" => $user
        ];
    }

    public function register(Request $request)
    {
        $request->validate([
            "name" => "required",
            "email" => "required|email|unique:users",
            "password" => "required",
            "passwordAgain" => "required|same:password"
        ]);

        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => bcrypt($request->password)
        ]);

        $token = $user->createToken("auth_token")->plainTextToken;

        return [
            "token" => $token
        ];
    }

    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        $credentials = $request->only("email", "password");

        if (auth()->attempt($credentials)) {
            $user = User::find(auth()->guard("sanctum")->id());
            $token = $user->createToken("auth_token")->plainTextToken;

            return [
                "token" => $token
            ];
        }

        return response()->json([
            "message" => "Invalid credentials"
        ], 401);
    }
}
