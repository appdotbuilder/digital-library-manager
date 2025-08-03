import { AppShell } from '@/components/app-shell';
import { Head, Link, router } from '@inertiajs/react';

interface LibraryItem {
    id: number;
    title: string;
    author?: string;
    type: 'book' | 'journal' | 'audio' | 'video';
    status: 'available' | 'borrowed' | 'reserved';
    available_copies: number;
    total_copies: number;
    created_at: string;
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
    stats: {
        total_items: number;
        available_items: number;
        borrowed_items: number;
        reserved_items: number;
        books: number;
        journals: number;
        audio: number;
        video: number;
    };
    filters: {
        search: string;
        type: string;
    };
    [key: string]: unknown;
}

export default function LibrarianDashboard({ items, stats, filters }: Props) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchParams = new URLSearchParams();
        
        formData.forEach((value, key) => {
            if (value && value !== 'all') {
                searchParams.append(key, value.toString());
            }
        });

        router.get('/librarian', Object.fromEntries(searchParams), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (itemId: number, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            router.delete(`/librarian/${itemId}`, {
                preserveState: true,
                preserveScroll: true,
            });
        }
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
        <AppShell>
            <Head title="📊 Librarian Dashboard" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Librarian Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your digital library collection</p>
                    </div>
                    <Link
                        href="/librarian/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                        ➕ Add New Item
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_items}</p>
                            </div>
                            <div className="text-3xl">📚</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.available_items}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Borrowed</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.borrowed_items}</p>
                            </div>
                            <div className="text-3xl">📖</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Reserved</p>
                                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.reserved_items}</p>
                            </div>
                            <div className="text-3xl">🔖</div>
                        </div>
                    </div>
                </div>

                {/* Content Type Breakdown */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Collection Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-3xl mb-2">📚</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.books}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Books</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">📰</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.journals}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Journals</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">🎵</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.audio}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Audio</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">🎬</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.video}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Video</div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Search Items
                            </label>
                            <input
                                type="text"
                                id="search"
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Search by title, author, or ISBN..."
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
                                <option value="book">📚 Books</option>
                                <option value="journal">📰 Journals</option>
                                <option value="audio">🎵 Audio</option>
                                <option value="video">🎬 Video</option>
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
                    </form>
                </div>

                {/* Items Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Library Items ({items.total} total)
                        </h3>
                    </div>

                    {items.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Item
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Added
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {items.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {item.title}
                                                        </div>
                                                        {item.author && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                by {item.author}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center space-x-1">
                                                        <span>{getTypeIcon(item.type)}</span>
                                                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                                                            {item.type}
                                                        </span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(item.status, item.available_copies, item.total_copies)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Link
                                                        href={`/librarian/${item.id}`}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/librarian/${item.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id, item.title)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {items.last_page > 1 && (
                                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                                    <nav className="flex justify-center">
                                        <div className="flex items-center space-x-2">
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
                                        </div>
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first library item.</p>
                            <Link
                                href="/librarian/create"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                            >
                                ➕ Add New Item
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}