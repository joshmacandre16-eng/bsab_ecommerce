<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    private function customerUser(): User
    {
        $user = User::factory()->create();
        $user->assignRole('customer');
        return $user;
    }

    private function makeProduct(int $stock = 10): Product
    {
        return Product::factory()->create([
            'price'          => 19.99,
            'stock_quantity' => $stock,
            'status'         => 'active',
        ]);
    }

    public function test_customer_can_view_cart()
    {
        $this->actingAs($this->customerUser())
            ->get(route('cart.index'))
            ->assertStatus(200);
    }

    public function test_customer_can_add_product_to_cart()
    {
        $user    = $this->customerUser();
        $product = $this->makeProduct();

        $this->actingAs($user)
            ->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 2])
            ->assertRedirect();

        $this->assertDatabaseHas('cart_items', ['product_id' => $product->id, 'quantity' => 2]);
    }

    public function test_cannot_add_more_than_stock()
    {
        $user    = $this->customerUser();
        $product = $this->makeProduct(stock: 1);

        $this->actingAs($user)
            ->post(route('cart.add'), ['product_id' => $product->id, 'quantity' => 5])
            ->assertSessionHas('error');
    }

    public function test_customer_can_update_cart_item()
    {
        $user    = $this->customerUser();
        $product = $this->makeProduct();
        $cart    = Cart::factory()->create(['user_id' => $user->id]);
        $item    = CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1, 'unit_price' => 19.99]);

        $this->actingAs($user)
            ->patch(route('cart.update'), ['cart_item_id' => $item->id, 'quantity' => 3])
            ->assertRedirect();

        $this->assertDatabaseHas('cart_items', ['id' => $item->id, 'quantity' => 3]);
    }

    public function test_customer_can_remove_cart_item()
    {
        $user    = $this->customerUser();
        $product = $this->makeProduct();
        $cart    = Cart::factory()->create(['user_id' => $user->id]);
        $item    = CartItem::factory()->create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1, 'unit_price' => 19.99]);

        $this->actingAs($user)
            ->delete(route('cart.remove', $item->id))
            ->assertRedirect();

        $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
    }

    public function test_guest_cannot_access_cart()
    {
        $this->get(route('cart.index'))->assertRedirect(route('login'));
    }

    public function test_add_to_cart_requires_product_id()
    {
        $this->actingAs($this->customerUser())
            ->post(route('cart.add'), ['quantity' => 1])
            ->assertSessionHasErrors('product_id');
    }
}
