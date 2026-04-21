<?php

namespace App\Repositories;

use App\Models\PerangkatDaerah;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * PerangkatDaerahRepository handles persistence operations for perangkat daerah.
 */
class PerangkatDaerahRepository
{
    /**
     * Return paginated perangkat daerah list with optional search.
     */
    public function paginate(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        return PerangkatDaerah::query()
            ->when($search, function ($query) use ($search) {
                $lowerSearch = strtolower($search);
                $query->where(function ($searchQuery) use ($lowerSearch) {
                    $searchQuery
                        ->whereRaw('LOWER(name) LIKE ?', ["%{$lowerSearch}%"])
                        ->orWhereRaw('LOWER(description) LIKE ?', ["%{$lowerSearch}%"])
                        ->orWhereRaw('LOWER(slug) LIKE ?', ["%{$lowerSearch}%"]);
                });
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Return all perangkat daerah sorted by name.
     */
    public function all(): Collection
    {
        return PerangkatDaerah::query()->orderBy('name')->get();
    }

    /**
     * Create perangkat daerah entity.
     */
    public function create(array $payload): PerangkatDaerah
    {
        return PerangkatDaerah::query()->create($payload);
    }

    /**
     * Find perangkat daerah by id.
     */
    public function findOrFail(int $id): PerangkatDaerah
    {
        return PerangkatDaerah::query()->findOrFail($id);
    }

    /**
     * Find perangkat daerah by slug.
     */
    public function findBySlugOrFail(string $slug): PerangkatDaerah
    {
        return PerangkatDaerah::query()->where('slug', $slug)->firstOrFail();
    }

    /**
     * Update perangkat daerah entity.
     */
    public function update(PerangkatDaerah $perangkatDaerah, array $payload): PerangkatDaerah
    {
        $perangkatDaerah->update($payload);

        return $perangkatDaerah->refresh();
    }

    /**
     * Delete perangkat daerah entity.
     */
    public function delete(PerangkatDaerah $perangkatDaerah): void
    {
        $perangkatDaerah->delete();
    }
}
