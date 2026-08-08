<?php

namespace Database\Factories;

use App\Enums\Project\ProjectPriority;
use App\Enums\Project\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 month', '+2 months');

        return [
            'client_name' => fake()->company(),
            'project_name' => rtrim(fake()->catchPhrase(), '.'),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(ProjectStatus::cases()),
            'priority' => fake()->randomElement(ProjectPriority::cases()),
            'start_date' => $startDate,
            'due_date' => fake()->dateTimeBetween($startDate, '+4 months'),
        ];
    }

    /**
     * State: a completed project.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => ProjectStatus::Completed,
        ]);
    }
}
