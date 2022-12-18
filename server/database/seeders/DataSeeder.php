<?php

namespace Database\Seeders;

use App\Console\Commands\PopulateOrders;
use App\Console\Commands\PopulateReviews;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class DataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Create 10 categories
        for ($i = 0; $i < 10; $i++) {
            DB::table('categories')->insert([
                'name' => $faker->lexify('cat-????'),
                'description' => $faker->text,
                'image' => $faker->imageUrl(640, 480, 'cats', true, 'Faker'),
                "created_at" => Carbon::now(),
                "updated_at" => Carbon::now(),
            ]);
        }

        // Create 20 brands
        for ($i = 0; $i < 50; $i++) {
            DB::table('brands')->insert([
                'name' => $faker->lexify('brand-????'),
                'category_id' => $faker->numberBetween(1, 10),
                "created_at" => Carbon::now(),
                "updated_at" => Carbon::now(),
            ]);
        }

        // Create 200 products

        for ($i = 0; $i < 200; $i++) {
            DB::table('products')->insert([
                'name' => $faker->lexify('prod-????'),
                'description' => $faker->text,
                "long_description" => $faker->text,
                'price' => $faker->numberBetween(100, 1000),
                'stock' => $faker->numberBetween(0, 100),
                'category_id' => $faker->numberBetween(1, 10),
                'brand_id' => $faker->numberBetween(1, 20),
                "buy_price" => $faker->numberBetween(100, 1000),
                "base_price" => $faker->numberBetween(100, 1000),
                "created_at" => Carbon::now(),
                "updated_at" => Carbon::now(),
            ]);

            // Create 5 product images

            for ($j = 0; $j < 5; $j++) {
                DB::table('product_images')->insert([
                    'file_path' => $faker->imageUrl(640, 480, 'prod', true, 'Image'),
                    'product_id' => $i + 1,
                    "created_at" => Carbon::now(),
                    "updated_at" => Carbon::now(),
                ]);
            }
        }

        // Create 20 best sellers

        for ($i = 0; $i < 20; $i++) {
            DB::table('best_sellers')->insert([
                "product_id" => $faker->numberBetween(1, 200),
                "created_at" => Carbon::now(),
                "updated_at" => Carbon::now(),
            ]);
        }

        $user = new User();
        $user->name = 'admin';
        $user->email = 'mikolaj73@gmail.com';
        $user->role = "admin";
        $user->password = bcrypt('testtest');
        $user->save();

        // Create 500 properties

        for ($i = 0; $i < 600; $i++) {
            DB::table('product_properties')->insert([
                'name' => $faker->lexify('prop-????'),
                'product_id' => $faker->numberBetween(1, 200),
                "created_at" => Carbon::now(),
                "updated_at" => Carbon::now(),
            ]);
        }

        // Create 1500 property fields

        for ($i = 0; $i < 1500; $i++) {
            DB::table('property_fields')->insert([
                'name' => $faker->lexify('field-????'),
                'property_id' => $faker->numberBetween(1, 600),
                "type" => $faker->randomElement(['subtractive', 'additive', '']),
                "adjusted_price" => $faker->numberBetween(0, 100),
                "stock" => $faker->numberBetween(0, 100),
                "created_at" => Carbon::now(),
                "updated_at" => Carbon::now(),
            ]);
        }

        $command = new PopulateReviews();
        $command->handle();

        $command = new PopulateOrders();
        $command->handle();
    }
}
