<?php

namespace App\Actions\Projects;

use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListProjects
{
    /**
     * Columns that may be sorted on. Guards against sorting by
     * arbitrary/unindexed columns injected via the query string.
     *
     * @var list<string>
     */
    private const SORTABLE = [
        'created_at',
        'client_name',
        'project_name',
        'status',
        'priority',
        'start_date',
        'due_date',
    ];

    /**
     * Return a filtered, sorted, paginated list of projects.
     *
     * @param  array<string, mixed>  $filters
     */
    public function handle(array $filters): LengthAwarePaginator
    {
        $sort = in_array($filters['sort'] ?? null, self::SORTABLE, true)
            ? $filters['sort']
            : 'created_at';

        $direction = ($filters['direction'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        return Project::query()
            ->when(
                $filters['search'] ?? null,
                fn ($query, string $search) => $query->where(function ($query) use ($search) {
                    $query->where('client_name', 'like', "%{$search}%")
                        ->orWhere('project_name', 'like', "%{$search}%");
                })
            )
            ->when(
                $filters['status'] ?? null,
                fn ($query, string $status) => $query->where('status', $status)
            )
            ->when(
                $filters['priority'] ?? null,
                fn ($query, string $priority) => $query->where('priority', $priority)
            )
            ->orderBy($sort, $direction)
            ->paginate($filters['per_page'] ?? 15)
            ->withQueryString();
    }
}
