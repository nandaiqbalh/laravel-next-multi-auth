<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ServiceFormField model stores dynamic form definition per service.
 */
class ServiceFormField extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'service_id',
        'label',
        'name',
        'type',
        'is_required',
        'options',
        'order',
        'placeholder',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'options' => 'array',
    ];

    /**
     * Resolve related service catalog entity.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(ServiceCatalog::class, 'service_id');
    }
}
