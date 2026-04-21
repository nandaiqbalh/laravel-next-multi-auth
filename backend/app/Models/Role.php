<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * Role model stores user role definitions for RBAC.
 */
class Role extends Model
{
    protected $fillable = ['name', 'slug', 'perangkat_daerah_id'];

    /**
     * Auto-generate unique slug when missing.
     */
    protected static function booted(): void
    {
        static::creating(function (Role $role) {
            if (! $role->slug) {
                $role->slug = static::generateUniqueSlug($role->name);
            }
        });

        static::updating(function (Role $role) {
            if ($role->isDirty('name') && ! $role->isDirty('slug')) {
                $role->slug = static::generateUniqueSlug($role->name, $role->id);
            }
        });
    }

    /**
     * Define relationship from role to perangkat daerah.
     */
    public function perangkatDaerah(): BelongsTo
    {
        return $this->belongsTo(PerangkatDaerah::class);
    }

    /**
     * Define relationship from role to users.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
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
