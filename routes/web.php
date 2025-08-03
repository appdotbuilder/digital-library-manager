<?php

use App\Http\Controllers\LibrarianController;
use App\Http\Controllers\LibraryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Library homepage with search and browse functionality
Route::get('/', [LibraryController::class, 'index'])->name('home');

// Public library item details
Route::get('/library/{item}', [LibraryController::class, 'show'])->name('library.show');

// Borrow functionality (requires authentication)
Route::post('/library/{item}/borrow', [LibraryController::class, 'store'])
    ->middleware('auth')
    ->name('library.borrow');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard redirects to the library homepage for authenticated users
    Route::get('dashboard', function () {
        return redirect()->route('home');
    })->name('dashboard');

    // Librarian management routes
    Route::prefix('librarian')->name('librarian.')->group(function () {
        Route::get('/', [LibrarianController::class, 'index'])->name('index');
        Route::get('/create', [LibrarianController::class, 'create'])->name('create');
        Route::post('/', [LibrarianController::class, 'store'])->name('store');
        Route::get('/{item}', [LibrarianController::class, 'show'])->name('show');
        Route::get('/{item}/edit', [LibrarianController::class, 'edit'])->name('edit');
        Route::put('/{item}', [LibrarianController::class, 'update'])->name('update');
        Route::delete('/{item}', [LibrarianController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
