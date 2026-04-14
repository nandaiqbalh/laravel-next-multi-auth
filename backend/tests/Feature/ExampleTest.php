<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * It returns API health response in standardized JSON contract.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->getJson('/');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'error',
                'message',
                'data',
            ]);
    }
}
