import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface LibraryItem {
    id: number;
    title: string;
    author?: string;
    description?: string;
    type: 'book' | 'journal' | 'audio' | 'video';
    status: 'available' | 'borrowed' | 'reserved';
    genre?: string;
    language: string;
    publication_year?: number;
    rating?: number;
    available_copies: number;
    total_copies: number;
    type_display: string;
    status_color: string;
}

interface PaginatedItems {
    data: LibraryItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    items: PaginatedItems;
    filters: {
        search: string;
        type: string;
        status: string;
        genre: string;
    };
    types: string[];
    genres: string[];
    stats: {
        total_items: number;
        available_items: number;
        books: number;
        journals: number;
        audio: number;
        video: number;
    };
    [key: string]: unknown;
}

export default function Welcome({ items, filters, types, genres, stats }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchParams = new URLSearchParams();
        
        formData.forEach((value, key) => {
            if (value && value !== 'all') {
                searchParams.append(key, value.toString());
            }
        });

        router.get('/', Object.fromEntries(searchParams), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleBorrow = (itemId: number) => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        router.post(`/library/${itemId}/borrow`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'book': return '📚';
            case 'journal': return '📰';
            case 'audio': return '🎵';
            case 'video': return '🎬';
            default: return '📄';
        }
    };

    const getStatusBadge = (status: string, available: number, total: number) => {
        const colors = {
            available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            borrowed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            reserved: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
                {status} ({available}/{total})
            </span>
        );
    };

    return (
        <>
            <Head title="📚 Digital Library">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${isDarkMode ? 'dark' : ''}`}>
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo and Library Name */}
                            <div className="flex items-center space-x-3">
                                <div className="text-3xl">📚</div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Digital Library</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Discover • Borrow • Learn</p>
                                </div>
                            </div>

                            {/* Header Controls */}
                            <div className="flex items-center space-x-4">
                                {/* Language Toggle */}
                                <select 
                                    value={currentLanguage}
                                    onChange={(e) => setCurrentLanguage(e.target.value)}
                                    className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                >
                                    <option value="en">🇺🇸 English</option>
                                    <option value="es">🇪🇸 Español</option>
                                    <option value="fr">🇫🇷 Français</option>
                                    <option value="de">🇩🇪 Deutsch</option>
                                </select>

                                {/* Dark Mode Toggle */}
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    title="Toggle dark mode"
                                >
                                    {isDarkMode ? '☀️' : '🌙'}
                                </button>

                                {/* Auth Links */}
                                <div className="flex items-center space-x-2">
                                    {auth.user ? (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                                            >
                                                Dashboard
                                            </Link>
                                            {auth.user && (
                                                <Link
                                                    href="/librarian"
                                                    className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                                                >
                                                    📊 Librarian
                                                </Link>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Bar */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_items}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total Items</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.available_items}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Available</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.books}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">📚 Books</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.journals}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">📰 Journals</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.audio}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">🎵 Audio</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.video}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">🎬 Video</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="md:col-span-2">
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    🔍 Search Collection
                                </label>
                                <input
                                    type="text"
                                    id="search"
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Search by title, author, or description..."
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Type
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    defaultValue={filters.type}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="all">All Types</option>
                                    {types.map((type) => (
                                        <option key={type} value={type}>
                                            {getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Genre
                                </label>
                                <select
                                    id="genre"
                                    name="genre"
                                    defaultValue={filters.genre}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="all">All Genres</option>
                                    {genres.map((genre) => (
                                        <option key={genre} value={genre}>{genre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Book List */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    {items.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.data.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="text-2xl">{getTypeIcon(item.type)}</div>
                                                {getStatusBadge(item.status, item.available_copies, item.total_copies)}
                                            </div>
                                            
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                {item.title}
                                            </h3>
                                            
                                            {item.author && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    by {item.author}
                                                </p>
                                            )}

                                            {item.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                {item.genre && <span>{item.genre}</span>}
                                                {item.publication_year && <span>{item.publication_year}</span>}
                                                {item.rating && (
                                                    <span className="flex items-center">
                                                        ⭐ {item.rating.toFixed(1)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/library/${item.id}`}
                                                    className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center font-medium"
                                                >
                                                    View Details
                                                </Link>
                                                
                                                {item.status === 'available' && item.available_copies > 0 && (
                                                    <button
                                                        onClick={() => handleBorrow(item.id)}
                                                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                                    >
                                                        Borrow
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {items.last_page > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {items.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or browse all available items.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="text-2xl">📚</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Digital Library</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Your gateway to knowledge, discovery, and learning. Access thousands of books, journals, and multimedia resources.
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Browse Books</a></li>
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Search Journals</a></li>
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Audio Collection</a></li>
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Video Resources</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Services</h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Digital Lending</a></li>
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Research Support</a></li>
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Study Rooms</a></li>
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Help & Support</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Contact</h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li>📧 library@example.com</li>
                                    <li>📞 (555) 123-4567</li>
                                    <li>📍 123 Library Lane</li>
                                    <li>🕒 Mon-Fri: 8AM-10PM</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                © 2024 Digital Library. Built with ❤️ for learning and discovery.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}