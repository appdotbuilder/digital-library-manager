<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLibraryItemRequest;
use App\Http\Requests\UpdateLibraryItemRequest;
use App\Models\LibraryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibrarianController extends Controller
{
    /**
     * Display the librarian dashboard.
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
                  ->orWhere('isbn', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by type
        if ($request->filled('type') && $request->get('type') !== 'all') {
            $query->where('type', $request->get('type'));
        }

        $items = $query->latest()->paginate(10)->appends($request->query());

        // Get statistics
        $stats = [
            'total_items' => LibraryItem::count(),
            'available_items' => LibraryItem::where('status', 'available')->count(),
            'borrowed_items' => LibraryItem::where('status', 'borrowed')->count(),
            'reserved_items' => LibraryItem::where('status', 'reserved')->count(),
            'books' => LibraryItem::where('type', 'book')->count(),
            'journals' => LibraryItem::where('type', 'journal')->count(),
            'audio' => LibraryItem::where('type', 'audio')->count(),
            'video' => LibraryItem::where('type', 'video')->count(),
        ];

        return Inertia::render('librarian/dashboard', [
            'items' => $items,
            'stats' => $stats,
            'filters' => [
                'search' => $request->get('search', ''),
                'type' => $request->get('type', 'all'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new library item.
     */
    public function create()
    {
        return Inertia::render('librarian/create');
    }

    /**
     * Store a newly created library item.
     */
    public function store(StoreLibraryItemRequest $request)
    {
        $validated = $request->validated();
        
        // Set available copies equal to total copies for new items
        if (!isset($validated['available_copies'])) {
            $validated['available_copies'] = $validated['total_copies'] ?? 1;
        }

        $item = LibraryItem::create($validated);

        return redirect()->route('librarian.show', $item)
            ->with('success', 'Library item created successfully.');
    }

    /**
     * Display the specified library item.
     */
    public function show(LibraryItem $item)
    {
        return Inertia::render('librarian/show', [
            'item' => $item,
        ]);
    }

    /**
     * Show the form for editing the specified library item.
     */
    public function edit(LibraryItem $item)
    {
        return Inertia::render('librarian/edit', [
            'item' => $item,
        ]);
    }

    /**
     * Update the specified library item.
     */
    public function update(UpdateLibraryItemRequest $request, LibraryItem $item)
    {
        $item->update($request->validated());

        return redirect()->route('librarian.show', $item)
            ->with('success', 'Library item updated successfully.');
    }

    /**
     * Remove the specified library item from storage.
     */
    public function destroy(LibraryItem $item)
    {
        $item->delete();

        return redirect()->route('librarian.index')
            ->with('success', 'Library item deleted successfully.');
    }
}