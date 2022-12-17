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
        Schema::create('property_fields', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string("type")->nullable();
            $table->double("adjusted_price")->nullable();
            $table->integer("stock")->nullable();
            $table->integer("property_id");
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
        Schema::dropIfExists('property_fields');
    }
};
