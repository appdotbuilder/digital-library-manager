<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LibraryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryController extends Controller
{
    /**
     * Display the library homepage.
     */
    public function index(Request $request)
    {
        $query = LibraryItem::query();

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->get('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('author', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhere('genre', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by type
        if ($request->filled('type') && $request->get('type') !== 'all') {
            $query->where('type', $request->get('type'));
        }

        // Filter by status
        if ($request->filled('status') && $request->get('status') !== 'all') {
            $query->where('status', $request->get('status'));
        }

        // Filter by genre
        if ($request->filled('genre') && $request->get('genre') !== 'all') {
            $query->where('genre', $request->get('genre'));
        }

        $items = $query->latest()->paginate(12)->appends($request->query());

        // Get filter options
        $types = LibraryItem::distinct()->pluck('type')->sort()->values();
        $genres = LibraryItem::distinct()->whereNotNull('genre')->pluck('genre')->sort()->values();
        $stats = [
            'total_items' => LibraryItem::count(),
            'available_items' => LibraryItem::where('status', 'available')->count(),
            'books' => LibraryItem::where('type', 'book')->count(),
            'journals' => LibraryItem::where('type', 'journal')->count(),
            'audio' => LibraryItem::where('type', 'audio')->count(),
            'video' => LibraryItem::where('type', 'video')->count(),
        ];

        return Inertia::render('welcome', [
            'items' => $items,
            'filters' => [
                'search' => $request->get('search', ''),
                'type' => $request->get('type', 'all'),
                'status' => $request->get('status', 'all'),
                'genre' => $request->get('genre', 'all'),
            ],
            'types' => $types,
            'genres' => $genres,
            'stats' => $stats,
        ]);
    }

    /**
     * Display the specified library item.
     */
    public function show(LibraryItem $item)
    {
        return Inertia::render('library/show', [
            'item' => $item,
        ]);
    }

    /**
     * Handle borrowing a library item.
     */
    public function store(Request $request)
    {
        $itemId = $request->route('item');
        $item = LibraryItem::findOrFail($itemId);
        
        if ($item->available_copies <= 0) {
            return back()->withErrors(['message' => 'This item is not available for borrowing.']);
        }

        $item->decrement('available_copies');
        
        if ($item->available_copies === 0) {
            $item->update(['status' => 'borrowed']);
        }

        return back()->with('success', 'Item borrowed successfully!');
    }
}