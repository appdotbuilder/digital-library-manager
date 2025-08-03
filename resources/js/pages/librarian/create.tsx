import { AppShell } from '@/components/app-shell';
import InputError from '@/components/input-error';
import { Head, router, useForm } from '@inertiajs/react';



interface LibraryItemFormData {
    title: string;
    author: string;
    isbn: string;
    description: string;
    type: 'book' | 'journal' | 'audio' | 'video';
    publisher: string;
    publication_year: string;
    genre: string;
    language: string;
    total_copies: string;
    rating: string;
    [key: string]: string;
}

export default function LibrarianCreate() {
    const { data, setData, post, processing, errors } = useForm<LibraryItemFormData>({
        title: '',
        author: '',
        isbn: '',
        description: '',
        type: 'book',
        publisher: '',
        publication_year: '',
        genre: '',
        language: 'en',
        total_copies: '1',
        rating: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/librarian');
    };

    return (
        <AppShell>
            <Head title="Add New Library Item" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">➕ Add New Library Item</h1>
                        <p className="text-gray-600 dark:text-gray-400">Add a new book, journal, audio, or video to your collection</p>
                    </div>
                    <button
                        onClick={() => router.visit('/librarian')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div>
                                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        value={data.author}
                                        onChange={(e) => setData('author', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <InputError message={errors.author} />
                                </div>

                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Type *
                                    </label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value as LibraryItemFormData['type'])}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="book">📚 Book</option>
                                        <option value="journal">📰 Journal</option>
                                        <option value="audio">🎵 Audio</option>
                                        <option value="video">🎬 Video</option>
                                    </select>
                                    <InputError message={errors.type} />
                                </div>

                                <div>
                                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ISBN
                                    </label>
                                    <input
                                        type="text"
                                        id="isbn"
                                        value={data.isbn}
                                        onChange={(e) => setData('isbn', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="978-0-123456-78-9"
                                    />
                                    <InputError message={errors.isbn} />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Brief description of the item..."
                            />
                            <InputError message={errors.description} />
                        </div>

                        {/* Publication Details */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Publication Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Publisher
                                    </label>
                                    <input
                                        type="text"
                                        id="publisher"
                                        value={data.publisher}
                                        onChange={(e) => setData('publisher', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <InputError message={errors.publisher} />
                                </div>

                                <div>
                                    <label htmlFor="publication_year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Publication Year
                                    </label>
                                    <input
                                        type="number"
                                        id="publication_year"
                                        min="1000"
                                        max={new Date().getFullYear() + 1}
                                        value={data.publication_year}
                                        onChange={(e) => setData('publication_year', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <InputError message={errors.publication_year} />
                                </div>

                                <div>
                                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Language
                                    </label>
                                    <select
                                        id="language"
                                        value={data.language}
                                        onChange={(e) => setData('language', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="en">🇺🇸 English</option>
                                        <option value="es">🇪🇸 Spanish</option>
                                        <option value="fr">🇫🇷 French</option>
                                        <option value="de">🇩🇪 German</option>
                                        <option value="it">🇮🇹 Italian</option>
                                    </select>
                                    <InputError message={errors.language} />
                                </div>

                                <div>
                                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Genre
                                    </label>
                                    <input
                                        type="text"
                                        id="genre"
                                        value={data.genre}
                                        onChange={(e) => setData('genre', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Fiction, Science, History, etc."
                                    />
                                    <InputError message={errors.genre} />
                                </div>

                                <div>
                                    <label htmlFor="total_copies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Total Copies *
                                    </label>
                                    <input
                                        type="number"
                                        id="total_copies"
                                        min="1"
                                        max="100"
                                        value={data.total_copies}
                                        onChange={(e) => setData('total_copies', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    <InputError message={errors.total_copies} />
                                </div>

                                <div>
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Rating (1-5)
                                    </label>
                                    <input
                                        type="number"
                                        id="rating"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={data.rating}
                                        onChange={(e) => setData('rating', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="4.2"
                                    />
                                    <InputError message={errors.rating} />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.visit('/librarian')}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {processing ? 'Adding...' : '➕ Add Library Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}