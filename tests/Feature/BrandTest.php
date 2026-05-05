<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        $user = User::factory()->create();
        $user->assignRole('admin');
        return $user;
    }

    public function test_admin_can_view_brands_index()
    {
        $this->actingAs($this->adminUser())
            ->get(route('admin.brands.index'))
            ->assertStatus(200);
    }

    public function test_admin_can_view_create_brand_form()
    {
        $this->actingAs($this->adminUser())
            ->get(route('admin.brands.create'))
            ->assertStatus(200);
    }

    public function test_admin_can_create_brand()
    {
        $this->actingAs($this->adminUser())
            ->post(route('admin.brands.store'), ['name' => 'Nike'])
            ->assertRedirect(route('admin.brands.index'));

        $this->assertDatabaseHas('brands', ['name' => 'Nike']);
    }

    public function test_brand_name_is_required()
    {
        $this->actingAs($this->adminUser())
            ->post(route('admin.brands.store'), ['name' => ''])
            ->assertSessionHasErrors('name');
    }

    public function test_brand_name_must_be_unique()
    {
        Brand::factory()->create(['name' => 'Nike']);

        $this->actingAs($this->adminUser())
            ->post(route('admin.brands.store'), ['name' => 'Nike'])
            ->assertSessionHasErrors('name');
    }

    public function test_admin_can_view_edit_brand_form()
    {
        $brand = Brand::factory()->create();

        $this->actingAs($this->adminUser())
            ->get(route('admin.brands.edit', $brand))
            ->assertStatus(200);
    }

    public function test_admin_can_update_brand()
    {
        $brand = Brand::factory()->create(['name' => 'OldName']);

        $this->actingAs($this->adminUser())
            ->put(route('admin.brands.update', $brand), ['name' => 'NewName'])
            ->assertRedirect(route('admin.brands.index'));

        $this->assertDatabaseHas('brands', ['name' => 'NewName']);
    }

    public function test_admin_can_delete_brand_without_products()
    {
        $brand = Brand::factory()->create();

        $this->actingAs($this->adminUser())
            ->delete(route('admin.brands.destroy', $brand))
            ->assertRedirect(route('admin.brands.index'));

        $this->assertDatabaseMissing('brands', ['id' => $brand->id]);
    }

    public function test_guest_cannot_access_brands()
    {
        $this->get(route('admin.brands.index'))->assertRedirect(route('login'));
    }
}
