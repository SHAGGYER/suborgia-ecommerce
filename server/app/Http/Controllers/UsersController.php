<?php

namespace App\Http\Controllers;

use App\Mail\PasswordReset;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UsersController extends Controller
{
    // search

    public function search(Request $request)
    {
        $users = User::query();


        $users = $this->handleAdditionalQuery($request, $users);
        $users = $this->handleOrderByQuery($request, $users);
        $users = $users->paginate(15);

        return response()->json(["content" => $users]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        $user->name = $request->input("name");
        $user->email = $request->input("email");
        $user->role = $request->input("role");
        $user->save();

        return response()->json(["content" => $user]);
    }

    public function delete(Request $request, $id)
    {
        User::destroy($id);

        return response()->json(["content" => "ok"]);
    }

    public function create(Request $request)
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
            "password" => bcrypt($request->password),
            "role" => $request->role
        ]);

        return response()->json(["content" => $user]);
    }

    public function sendPasswordResetToken(Request $request, $id)
    {
        $user = User::find($id);

        if ($user) {
            $user->password_reset_code = Str::random(5);
            $user->save();

            Mail::to($user->email)->send(new PasswordReset($user));
        }

        return response()->json(["content" => "ok"]);
    }
}
