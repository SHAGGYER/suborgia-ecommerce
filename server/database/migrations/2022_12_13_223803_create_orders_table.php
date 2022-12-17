<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('address');
            $table->string('city');
            $table->string('zip');
            $table->string('country');
            $table->integer("user_id")->nullable();
            $table->double("subtotal");
            $table->double("tax");
            $table->double("total");
            $table->double("discount")->nullable();
            $table->string("status")->enum(["pending", "shipped", "cancelled", "returned"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
