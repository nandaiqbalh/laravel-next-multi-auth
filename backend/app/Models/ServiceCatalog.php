<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * ServiceCatalog defines UMKM services that can be submitted.
 */
class ServiceCatalog extends Model
{
    protected $table = 'services';

    public $timestamps = false;

    protected $fillable = ['code', 'name', 'perangkat_daerah_id', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

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

    /**
     * Resolve parent perangkat daerah for this service.
     */
    public function perangkatDaerah(): BelongsTo
    {
        return $this->belongsTo(PerangkatDaerah::class, 'perangkat_daerah_id');
    }

    /**
     * Resolve dynamic form fields configured for this service.
     */
    public function formFields(): HasMany
    {
        return $this->hasMany(ServiceFormField::class, 'service_id')->orderBy('order');
    }
}
