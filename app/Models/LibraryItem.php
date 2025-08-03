<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\LibraryItem
 *
 * @property int $id
 * @property string $title
 * @property string|null $author
 * @property string|null $isbn
 * @property string|null $description
 * @property string $type
 * @property string $status
 * @property string|null $publisher
 * @property int|null $publication_year
 * @property string|null $genre
 * @property string $language
 * @property string|null $cover_image
 * @property int $total_copies
 * @property int $available_copies
 * @property float|null $rating
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereAuthor($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereAvailableCopies($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereCoverImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereGenre($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereIsbn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem wherePublicationYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem wherePublisher($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereTotalCopies($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem available()
 * @method static \Illuminate\Database\Eloquent\Builder|LibraryItem ofType($type)
 * @method static \Database\Factories\LibraryItemFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class LibraryItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'author',
        'isbn',
        'description',
        'type',
        'status',
        'publisher',
        'publication_year',
        'genre',
        'language',
        'cover_image',
        'total_copies',
        'available_copies',
        'rating',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'publication_year' => 'integer',
        'total_copies' => 'integer',
        'available_copies' => 'integer',
        'rating' => 'decimal:1',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope a query to only include available items.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available')->where('available_copies', '>', 0);
    }

    /**
     * Scope a query to only include items of a specific type.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get the display name for the item type.
     *
     * @return string
     */
    public function getTypeDisplayAttribute()
    {
        return match ($this->type) {
            'book' => '📚 Book',
            'journal' => '📰 Journal',
            'audio' => '🎵 Audio',
            'video' => '🎬 Video',
            default => ucfirst($this->type),
        };
    }

    /**
     * Get the status badge color.
     *
     * @return string
     */
    public function getStatusColorAttribute()
    {
        return match ($this->status) {
            'available' => 'green',
            'borrowed' => 'red',
            'reserved' => 'yellow',
            default => 'gray',
        };
    }
}