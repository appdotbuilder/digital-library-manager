import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

interface LibraryItem {
    id: number;
    title: string;
    author?: string;
    isbn?: string;
    description?: string;
    type: 'book' | 'journal' | 'audio' | 'video';
    status: 'available' | 'borrowed' | 'reserved';
    publisher?: string;
    publication_year?: number;
    genre?: string;
    language: string;
    rating?: number;
    available_copies: number;
    total_copies: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    item: LibraryItem;
    [key: string]: unknown;
}

export default function LibraryShow({ item }: Props) {
    const { auth } = usePage<SharedData>().props;

    const handleBorrow = () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        router.post(`/library/${item.id}/borrow`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
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
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)} ({available}/{total})
            </span>
        );
    };

    return (
        <>
            <Head title={`${item.title} - Digital Library`} />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <Link href="/" className="text-3xl hover:scale-110 transition-transform">📚</Link>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Digital Library</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Item Details</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
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
                </header>

                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
                        <span>→</span>
                        <span className="text-gray-900 dark:text-white">{item.title}</span>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                            {/* Cover/Icon Section */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg aspect-[3/4] flex items-center justify-center text-8xl">
                                    {getTypeIcon(item.type)}
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="mt-6 space-y-3">
                                    {item.status === 'available' && item.available_copies > 0 ? (
                                        <button
                                            onClick={handleBorrow}
                                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            🔖 Borrow This Item
                                        </button>
                                    ) : (
                                        <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-center font-medium">
                                            Currently Unavailable
                                        </div>
                                    )}
                                    
                                    <Link
                                        href="/"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-center block"
                                    >
                                        ← Back to Library
                                    </Link>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title and Status */}
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
                                        {getStatusBadge(item.status, item.available_copies, item.total_copies)}
                                    </div>
                                    
                                    {item.author && (
                                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                                            by {item.author}
                                        </p>
                                    )}

                                    {item.rating && (
                                        <div className="flex items-center space-x-2">
                                            <div className="flex text-yellow-400">
                                                {'⭐'.repeat(Math.floor(item.rating))}
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {item.rating.toFixed(1)} / 5.0
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                {item.description && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                )}

                                {/* Details Grid */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
                                            <dd className="text-base text-gray-900 dark:text-white mt-1">
                                                {getTypeIcon(item.type)} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                            </dd>
                                        </div>

                                        {item.genre && (
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Genre</dt>
                                                <dd className="text-base text-gray-900 dark:text-white mt-1">{item.genre}</dd>
                                            </div>
                                        )}

                                        {item.publisher && (
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Publisher</dt>
                                                <dd className="text-base text-gray-900 dark:text-white mt-1">{item.publisher}</dd>
                                            </div>
                                        )}

                                        {item.publication_year && (
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Publication Year</dt>
                                                <dd className="text-base text-gray-900 dark:text-white mt-1">{item.publication_year}</dd>
                                            </div>
                                        )}

                                        {item.isbn && (
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ISBN</dt>
                                                <dd className="text-base text-gray-900 dark:text-white mt-1 font-mono">{item.isbn}</dd>
                                            </div>
                                        )}

                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</dt>
                                            <dd className="text-base text-gray-900 dark:text-white mt-1">
                                                {item.language === 'en' && '🇺🇸 English'}
                                                {item.language === 'es' && '🇪🇸 Spanish'}
                                                {item.language === 'fr' && '🇫🇷 French'}
                                                {item.language === 'de' && '🇩🇪 German'}
                                                {!['en', 'es', 'fr', 'de'].includes(item.language) && item.language.toUpperCase()}
                                            </dd>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Copies Available</dt>
                                            <dd className="text-base text-gray-900 dark:text-white mt-1">
                                                {item.available_copies} of {item.total_copies}
                                            </dd>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Added to Library</dt>
                                            <dd className="text-base text-gray-900 dark:text-white mt-1">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    </div>
                                </div>

                                {/* Availability Notice */}
                                {!auth.user && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-blue-600 dark:text-blue-400">ℹ️</span>
                                            <p className="text-blue-800 dark:text-blue-200">
                                                <Link href="/login" className="font-medium underline hover:no-underline">
                                                    Sign in
                                                </Link> to borrow items from our digital library.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}