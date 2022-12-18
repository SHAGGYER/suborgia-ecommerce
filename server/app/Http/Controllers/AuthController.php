<?php

namespace App\Http\Controllers;

use App\Mail\PasswordReset;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

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

    public function adminLogin(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        $credentials = $request->only("email", "password");

        if (auth()->attempt($credentials)) {
            $user = User::find(auth()->guard("sanctum")->id());

            if (!$user->isAdmin()) {
                return response()->json([
                    "message" => "Invalid credentials"
                ], 401);
            }

            $token = $user->createToken("auth_token")->plainTextToken;

            return [
                "token" => $token
            ];
        }

        return response()->json([
            "message" => "Invalid credentials"
        ], 401);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            "email" => "required|email"
        ]);

        $user = User::where("email", $request->email)->first();
        if (!$user) {
            return response()->json([
                "message" => "User not found"
            ], 401);
        }

        $user->password_reset_code = Str::random(5);
        $user->save();

        Mail::to($user->email)->send(new PasswordReset($user));

        return response()->json([
            "message" => "Password reset code sent to your email"
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            "code" => "required",
            "password" => "required",
            "passwordAgain" => "required|same:password"
        ]);

        $user = User::where("password_reset_code", $request->code)->first();
        if (!$user) {
            return response()->json([
                "message" => "Invalid code"
            ], 401);
        }

        if ($user->password_reset_code != $request->code) {
            return response()->json([
                "message" => "Invalid code"
            ], 401);
        }

        $user->password = bcrypt($request->password);
        $user->password_reset_code = null;
        $user->save();

        return response()->json([
            "message" => "Password reset successfully"
        ]);
    }

    public function verifyPasswordResetCode(Request $request)
    {
        $request->validate([
            "code" => "required"
        ]);

        $user = User::where("password_reset_code", $request->code)->first();
        if (!$user) {
            return response()->json([
                "message" => "Invalid code"
            ], 401);
        }

        if ($user->password_reset_code != $request->code) {
            return response()->json([
                "message" => "Invalid code"
            ], 401);
        }

        return response()->json([
            "content" => $user
        ]);
    }
}
