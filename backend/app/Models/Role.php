<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Role model stores user role definitions for RBAC.
 */
class Role extends Model
{
    protected $fillable = ['name'];

    /**
     * Define relationship from role to users.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
