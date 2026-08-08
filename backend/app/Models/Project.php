<?php

namespace App\Models;

use App\Enums\Project\ProjectPriority;
use App\Enums\Project\ProjectStatus;
use Illuminate\Database\Eloquent\Model;
use Override;

class Project extends Model
{
    protected $fillable = [
        'client_name',
        'project_name',
        'description',
        'status',
        'priority',
        'start_date',
        'due_date',
    ];

    #[Override]
    public function casts()
    {
        return [
            'start_date' => 'date',
            'due_date' => 'date',
            'status' => ProjectStatus::class,
            'priority' => ProjectPriority::class,
        ];
    }
}
