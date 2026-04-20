<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * ServiceCatalog defines UMKM services that can be submitted.
 */
class ServiceCatalog extends Model
{
    protected $table = 'services';

    public $timestamps = false;

    protected $fillable = ['code', 'name'];

    /**
     * Resolve submissions associated to this service.
     *
     * @param void
     * @returns HasMany
     *
     * Usage:
     * $service->submissions()->count();
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'service_id');
    }
}
