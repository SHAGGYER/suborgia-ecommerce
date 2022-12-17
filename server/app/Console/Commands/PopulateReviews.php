<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PopulateReviews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reviews:populate';

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
        $faker = Faker::create();

        // populate 5000 reviews

        for ($i = 0; $i < 5000; $i++) {
            DB::table("reviews")->insert([
                "product_id" => $faker->numberBetween(1, 200),
                "user_id" => $faker->numberBetween(1, 1),
                "review" => $faker->text,
                "rating" => $faker->numberBetween(1, 5),
                "created_at" => $faker->dateTimeBetween("-1 week", "now"),
                "updated_at" => $faker->dateTimeBetween("-1 week", "now"),
            ]);
        }

        return Command::SUCCESS;
    }
}
