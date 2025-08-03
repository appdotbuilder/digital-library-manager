<?php

namespace Database\Seeders;

use App\Models\LibraryItem;
use Illuminate\Database\Seeder;

class LibrarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific featured items
        $featuredItems = [
            [
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'isbn' => '9780743273565',
                'description' => 'A classic American novel set in the summer of 1922, exploring themes of decadence, idealism, resistance to change, and excess.',
                'type' => 'book',
                'status' => 'available',
                'publisher' => 'Scribner',
                'publication_year' => 1925,
                'genre' => 'Fiction',
                'language' => 'en',
                'total_copies' => 3,
                'available_copies' => 2,
                'rating' => 4.2,
            ],
            [
                'title' => 'Nature Scientific Journal',
                'author' => 'Nature Publishing Group',
                'description' => 'Leading international weekly journal of science publishing the finest peer-reviewed research in all fields of science and technology.',
                'type' => 'journal',
                'status' => 'available',
                'publisher' => 'Nature Publishing Group',
                'publication_year' => 2024,
                'genre' => 'Science',
                'language' => 'en',
                'total_copies' => 5,
                'available_copies' => 5,
                'rating' => 4.8,
            ],
            [
                'title' => 'Atomic Habits (Audiobook)',
                'author' => 'James Clear',
                'description' => 'An easy and proven way to build good habits and break bad ones. This audiobook provides practical strategies for forming good habits.',
                'type' => 'audio',
                'status' => 'available',
                'publisher' => 'Avery',
                'publication_year' => 2018,
                'genre' => 'Self-Help',
                'language' => 'en',
                'total_copies' => 2,
                'available_copies' => 1,
                'rating' => 4.7,
            ],
            [
                'title' => 'The Planet Earth Documentary Series',
                'author' => 'BBC Natural History Unit',
                'description' => 'A comprehensive documentary series showcasing the natural world in unprecedented detail and beauty.',
                'type' => 'video',
                'status' => 'available',
                'publisher' => 'BBC',
                'publication_year' => 2006,
                'genre' => 'Documentary',
                'language' => 'en',
                'total_copies' => 1,
                'available_copies' => 1,
                'rating' => 4.9,
            ],
            [
                'title' => 'To Kill a Mockingbird',
                'author' => 'Harper Lee',
                'isbn' => '9780061120084',
                'description' => 'A gripping tale of racial injustice and childhood innocence in the American South.',
                'type' => 'book',
                'status' => 'borrowed',
                'publisher' => 'J.B. Lippincott & Co.',
                'publication_year' => 1960,
                'genre' => 'Fiction',
                'language' => 'en',
                'total_copies' => 2,
                'available_copies' => 0,
                'rating' => 4.3,
            ],
            [
                'title' => 'Harvard Business Review',
                'description' => 'The leading destination for smart management thinking, covering leadership, strategy, and innovation.',
                'type' => 'journal',
                'status' => 'available',
                'publisher' => 'Harvard Business Publishing',
                'publication_year' => 2024,
                'genre' => 'Business',
                'language' => 'en',
                'total_copies' => 3,
                'available_copies' => 3,
                'rating' => 4.5,
            ],
        ];

        foreach ($featuredItems as $item) {
            LibraryItem::create($item);
        }

        // Create additional random items using factory
        LibraryItem::factory()->book()->count(15)->create();
        LibraryItem::factory()->journal()->count(8)->create();
        LibraryItem::factory()->audio()->count(6)->create();
        LibraryItem::factory()->video()->count(4)->create();
    }
}