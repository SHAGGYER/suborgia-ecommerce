<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function init(Request $request) {
        $user = null;

        if (auth()->guard("sanctum")->check()) {
            $user = auth()->guard("sanctum")->user();
        }

        return [
            "user" => $user
        ];
    }

    public function login(Request $request) {
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
