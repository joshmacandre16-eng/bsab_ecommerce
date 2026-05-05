<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private function vendorUser(): User
    {
        $user = User::factory()->create();
        $user->assignRole('vendor');
        return $user;
    }

    private function productData(array $overrides = []): array
    {
        return array_merge([
            'name'                => 'Test Product',
            'description'         => 'A test product description',
            'price'               => 29.99,
            'stock_quantity'      => 10,
            'low_stock_threshold' => 2,
            'category_id'         => Category::factory()->create()->id,
            'brand_id'            => Brand::factory()->create()->id,
            'status'              => 'active',
        ], $overrides);
    }

    public function test_authenticated_user_can_view_products_index()
    {
        $user = User::factory()->create();
        $user->assignRole('customer');

        $this->actingAs($user)
            ->get(route('products.index'))
            ->assertStatus(200);
    }

    public function test_vendor_can_view_their_products()
    {
        $this->actingAs($this->vendorUser())
            ->get(route('vendor.products.index'))
            ->assertStatus(200);
    }

    public function test_vendor_can_view_create_product_form()
    {
        $this->actingAs($this->vendorUser())
            ->get(route('vendor.products.create'))
            ->assertStatus(200);
    }

    public function test_vendor_can_create_product()
    {
        $vendor = $this->vendorUser();

        $this->actingAs($vendor)
            ->post(route('vendor.products.store'), $this->productData())
            ->assertRedirect(route('vendor.products.index'));

        $this->assertDatabaseHas('products', ['name' => 'Test Product', 'vendor_id' => $vendor->id]);
    }

    public function test_product_name_is_required()
    {
        $this->actingAs($this->vendorUser())
            ->post(route('vendor.products.store'), $this->productData(['name' => '']))
            ->assertSessionHasErrors('name');
    }

    public function test_product_price_must_be_positive()
    {
        $this->actingAs($this->vendorUser())
            ->post(route('vendor.products.store'), $this->productData(['price' => -1]))
            ->assertSessionHasErrors('price');
    }

    public function test_vendor_can_view_edit_product_form()
    {
        $vendor = $this->vendorUser();
        $product = Product::factory()->create(['vendor_id' => $vendor->id]);

        $this->actingAs($vendor)
            ->get(route('vendor.products.edit', $product))
            ->assertStatus(200);
    }

    public function test_vendor_can_update_their_product()
    {
        $vendor = $this->vendorUser();
        $product = Product::factory()->create(['vendor_id' => $vendor->id]);

        $this->actingAs($vendor)
            ->put(route('vendor.products.update', $product), $this->productData(['name' => 'Updated Name']))
            ->assertRedirect(route('vendor.products.index'));

        $this->assertDatabaseHas('products', ['name' => 'Updated Name']);
    }

    public function test_vendor_cannot_edit_another_vendors_product()
    {
        $vendor1 = $this->vendorUser();
        $vendor2 = $this->vendorUser();
        $product = Product::factory()->create(['vendor_id' => $vendor2->id]);

        $this->actingAs($vendor1)
            ->get(route('vendor.products.edit', $product))
            ->assertStatus(403);
    }

    public function test_vendor_can_delete_their_product()
    {
        $vendor = $this->vendorUser();
        $product = Product::factory()->create(['vendor_id' => $vendor->id]);

        $this->actingAs($vendor)
            ->delete(route('vendor.products.destroy', $product))
            ->assertRedirect(route('vendor.products.index'));

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_guest_cannot_access_products()
    {
        $this->get(route('products.index'))->assertRedirect(route('login'));
    }
}
