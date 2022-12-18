<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $user = new User();
        $user->name = "Mikolaj Marciniak";
        $user->email = "mikolaj73@gmail.com";
        $user->password = bcrypt("testtest");
        $user->role = "admin";
        $user->save();

        return Command::SUCCESS;
    }
}
