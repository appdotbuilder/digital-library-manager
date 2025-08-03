<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLibraryItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:17|unique:library_items,isbn,' . $this->route('item')->id,
            'description' => 'nullable|string',
            'type' => 'required|in:book,journal,audio,video',
            'status' => 'required|in:available,borrowed,reserved',
            'publisher' => 'nullable|string|max:255',
            'publication_year' => 'nullable|integer|min:1000|max:' . (date('Y') + 1),
            'genre' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:10',
            'cover_image' => 'nullable|string|max:255',
            'total_copies' => 'required|integer|min:1|max:100',
            'available_copies' => 'required|integer|min:0|lte:total_copies',
            'rating' => 'nullable|numeric|min:0|max:5',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'type.required' => 'Please select an item type.',
            'type.in' => 'The selected type is invalid.',
            'status.required' => 'Please select a status.',
            'isbn.unique' => 'This ISBN is already used by another item.',
            'total_copies.required' => 'Please specify the number of copies.',
            'total_copies.min' => 'There must be at least 1 copy.',
            'available_copies.required' => 'Please specify available copies.',
            'available_copies.lte' => 'Available copies cannot exceed total copies.',
            'publication_year.min' => 'Publication year must be a valid year.',
            'publication_year.max' => 'Publication year cannot be in the future.',
            'rating.max' => 'Rating cannot exceed 5.',
        ];
    }
}