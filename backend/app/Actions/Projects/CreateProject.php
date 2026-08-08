<?php

namespace App\Actions\Projects;

use App\Models\Project;

class CreateProject
{
    /**
     * Create a new project from validated data.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): Project
    {
        return Project::create($data);
    }
}
