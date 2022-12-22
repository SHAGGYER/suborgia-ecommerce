<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use Illuminate\Console\Command;
use Faker\Factory as Faker;

class PopulateBlogItems extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blog:populate';

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
        BlogPost::truncate();

        // create 50 blog items

        for ($i = 0; $i < 50; $i++) {
            // create an array of words
            $words = $faker->words(3);

            BlogPost::create([
                "title" => $faker->sentence,
                "content" => $faker->sentences(20, true),
                "image" => $faker->imageUrl(640, 480, "blog"),
                "tags" => json_encode($words),
            ]);
        }

        return Command::SUCCESS;
    }
}
