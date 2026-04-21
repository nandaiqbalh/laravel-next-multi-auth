<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * PerangkatDaerah model stores agency master data.
 */
class PerangkatDaerah extends Model
{
    protected $fillable = ['name', 'description', 'slug'];

    /**
     * Auto-generate unique slug when missing.
     */
    protected static function booted(): void
    {
        static::creating(function (PerangkatDaerah $perangkatDaerah) {
            if (! $perangkatDaerah->slug) {
                $perangkatDaerah->slug = static::generateUniqueSlug($perangkatDaerah->name);
            }
        });

        static::updating(function (PerangkatDaerah $perangkatDaerah) {
            if ($perangkatDaerah->isDirty('name') && ! $perangkatDaerah->isDirty('slug')) {
                $perangkatDaerah->slug = static::generateUniqueSlug($perangkatDaerah->name, $perangkatDaerah->id);
            }
        });
    }

    /**
     * Resolve related service catalog items.
     */
    public function services(): HasMany
    {
        return $this->hasMany(ServiceCatalog::class, 'perangkat_daerah_id');
    }

    /**
     * Resolve related roles scoped under this perangkat daerah.
     */
    public function roles(): HasMany
    {
        return $this->hasMany(Role::class, 'perangkat_daerah_id');
    }

    /**
     * Build unique slug candidate.
     */
    private static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (static::query()
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = sprintf('%s-%d', $baseSlug, $counter++);
        }

        return $slug;
    }
}
