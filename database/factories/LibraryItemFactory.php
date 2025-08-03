<?php

namespace Database\Factories;

use App\Models\LibraryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LibraryItem>
 */
class LibraryItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\LibraryItem>
     */
    protected $model = LibraryItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['book', 'journal', 'audio', 'video']);
        $totalCopies = fake()->numberBetween(1, 5);
        $borrowedCopies = fake()->numberBetween(0, $totalCopies);
        
        return [
            'title' => $this->getTitle($type),
            'author' => $this->getAuthor($type),
            'isbn' => $type === 'book' ? fake()->isbn13() : null,
            'description' => fake()->paragraph(3),
            'type' => $type,
            'status' => fake()->randomElement(['available', 'borrowed', 'reserved']),
            'publisher' => fake()->company(),
            'publication_year' => fake()->numberBetween(1950, 2024),
            'genre' => $this->getGenre($type),
            'language' => fake()->randomElement(['en', 'es', 'fr', 'de', 'it']),
            'cover_image' => null,
            'total_copies' => $totalCopies,
            'available_copies' => $totalCopies - $borrowedCopies,
            'rating' => fake()->optional(0.7)->randomFloat(1, 1, 5),
        ];
    }

    /**
     * Get a title based on the item type.
     *
     * @param string $type
     * @return string
     */
    protected function getTitle(string $type): string
    {
        return match ($type) {
            'book' => fake()->sentence(random_int(2, 4), false),
            'journal' => fake()->company() . ' ' . fake()->randomElement(['Journal', 'Review', 'Quarterly', 'Magazine']),
            'audio' => fake()->sentence(random_int(2, 3), false) . ' (Audio)',
            'video' => fake()->sentence(random_int(2, 4), false) . ' (Documentary)',
            default => fake()->sentence(3, false),
        };
    }

    /**
     * Get an author based on the item type.
     *
     * @param string $type
     * @return string|null
     */
    protected function getAuthor(string $type): ?string
    {
        return match ($type) {
            'book' => fake()->name(),
            'journal' => fake()->optional(0.6)->name(),
            'audio' => fake()->name(),
            'video' => fake()->optional(0.8)->name(),
            default => fake()->name(),
        };
    }

    /**
     * Get a genre based on the item type.
     *
     * @param string $type
     * @return string
     */
    protected function getGenre(string $type): string
    {
        return match ($type) {
            'book' => fake()->randomElement(['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Biography', 'History', 'Science']),
            'journal' => fake()->randomElement(['Academic', 'Science', 'Technology', 'Medicine', 'Business', 'Arts', 'Literature']),
            'audio' => fake()->randomElement(['Audiobook', 'Podcast', 'Music', 'Educational', 'Documentary']),
            'video' => fake()->randomElement(['Documentary', 'Educational', 'Tutorial', 'Lecture', 'Conference']),
            default => 'General',
        };
    }

    /**
     * Indicate that the item is available.
     *
     * @return static
     */
    public function available()
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
            'available_copies' => $attributes['total_copies'],
        ]);
    }

    /**
     * Indicate that the item is a book.
     *
     * @return static
     */
    public function book()
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'book',
            'isbn' => fake()->isbn13(),
        ]);
    }

    /**
     * Indicate that the item is a journal.
     *
     * @return static
     */
    public function journal()
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'journal',
            'isbn' => null,
        ]);
    }

    /**
     * Indicate that the item is audio content.
     *
     * @return static
     */
    public function audio()
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'audio',
            'isbn' => null,
        ]);
    }

    /**
     * Indicate that the item is video content.
     *
     * @return static
     */
    public function video()
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'video',
            'isbn' => null,
        ]);
    }
}