<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        $user = User::factory()->create();
        $user->assignRole('admin');
        return $user;
    }

    public function test_admin_can_view_categories_index()
    {
        $this->actingAs($this->adminUser())
            ->get(route('admin.categories.index'))
            ->assertStatus(200);
    }

    public function test_admin_can_view_create_category_form()
    {
        $this->actingAs($this->adminUser())
            ->get(route('admin.categories.create'))
            ->assertStatus(200);
    }

    public function test_admin_can_create_category()
    {
        $this->actingAs($this->adminUser())
            ->post(route('admin.categories.store'), ['name' => 'Electronics'])
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', ['name' => 'Electronics']);
    }

    public function test_category_name_is_required()
    {
        $this->actingAs($this->adminUser())
            ->post(route('admin.categories.store'), ['name' => ''])
            ->assertSessionHasErrors('name');
    }

    public function test_admin_can_create_subcategory()
    {
        $parent = Category::factory()->create();

        $this->actingAs($this->adminUser())
            ->post(route('admin.categories.store'), [
                'name' => 'Phones',
                'parent_category_id' => $parent->id,
            ])
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', ['name' => 'Phones', 'parent_category_id' => $parent->id]);
    }

    public function test_admin_can_view_edit_category_form()
    {
        $category = Category::factory()->create();

        $this->actingAs($this->adminUser())
            ->get(route('admin.categories.edit', $category))
            ->assertStatus(200);
    }

    public function test_admin_can_update_category()
    {
        $category = Category::factory()->create(['name' => 'Old']);

        $this->actingAs($this->adminUser())
            ->put(route('admin.categories.update', $category), ['name' => 'New'])
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', ['name' => 'New']);
    }

    public function test_admin_can_delete_empty_category()
    {
        $category = Category::factory()->create();

        $this->actingAs($this->adminUser())
            ->delete(route('admin.categories.destroy', $category))
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_guest_cannot_access_categories()
    {
        $this->get(route('admin.categories.index'))->assertRedirect(route('login'));
    }
}
