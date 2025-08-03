<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('library_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author')->nullable();
            $table->string('isbn')->nullable()->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['book', 'journal', 'audio', 'video'])->default('book');
            $table->enum('status', ['available', 'borrowed', 'reserved'])->default('available');
            $table->string('publisher')->nullable();
            $table->year('publication_year')->nullable();
            $table->string('genre')->nullable();
            $table->string('language')->default('en');
            $table->string('cover_image')->nullable();
            $table->integer('total_copies')->default(1);
            $table->integer('available_copies')->default(1);
            $table->decimal('rating', 2, 1)->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index('title');
            $table->index('author');
            $table->index('type');
            $table->index('status');
            $table->index('genre');
            $table->index(['type', 'status']);
            $table->index(['title', 'author']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_items');
    }
};