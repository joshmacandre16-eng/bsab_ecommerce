<?php

namespace Tests\Feature;

use App\Models\Coupon;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CouponTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        $user = User::factory()->create();
        $user->assignRole('admin');
        return $user;
    }

    private function couponData(array $overrides = []): array
    {
        return array_merge([
            'code'       => 'SAVE10',
            'type'       => 'percentage',
            'value'      => 10,
            'valid_from' => now()->toDateString(),
            'valid_to'   => now()->addMonth()->toDateString(),
        ], $overrides);
    }

    public function test_admin_can_view_coupons_index()
    {
        $this->actingAs($this->adminUser())
            ->get(route('admin.coupons.index'))
            ->assertStatus(200);
    }

    public function test_admin_can_view_create_coupon_form()
    {
        $this->actingAs($this->adminUser())
            ->get(route('admin.coupons.create'))
            ->assertStatus(200);
    }

    public function test_admin_can_create_coupon()
    {
        $this->actingAs($this->adminUser())
            ->post(route('admin.coupons.store'), $this->couponData())
            ->assertRedirect(route('admin.coupons.index'));

        $this->assertDatabaseHas('coupons', ['code' => 'SAVE10']);
    }

    public function test_coupon_code_is_required()
    {
        $this->actingAs($this->adminUser())
            ->post(route('admin.coupons.store'), $this->couponData(['code' => '']))
            ->assertSessionHasErrors('code');
    }

    public function test_coupon_code_must_be_unique()
    {
        Coupon::factory()->create(['code' => 'SAVE10']);

        $this->actingAs($this->adminUser())
            ->post(route('admin.coupons.store'), $this->couponData(['code' => 'SAVE10']))
            ->assertSessionHasErrors('code');
    }

    public function test_coupon_valid_to_must_be_after_valid_from()
    {
        $this->actingAs($this->adminUser())
            ->post(route('admin.coupons.store'), $this->couponData([
                'valid_from' => now()->toDateString(),
                'valid_to'   => now()->subDay()->toDateString(),
            ]))
            ->assertSessionHasErrors('valid_to');
    }

    public function test_admin_can_view_edit_coupon_form()
    {
        $coupon = Coupon::factory()->create();

        $this->actingAs($this->adminUser())
            ->get(route('admin.coupons.edit', $coupon))
            ->assertStatus(200);
    }

    public function test_admin_can_update_coupon()
    {
        $coupon = Coupon::factory()->create(['code' => 'OLD10']);

        $this->actingAs($this->adminUser())
            ->put(route('admin.coupons.update', $coupon), $this->couponData(['code' => 'NEW20', 'value' => 20]))
            ->assertRedirect(route('admin.coupons.index'));

        $this->assertDatabaseHas('coupons', ['code' => 'NEW20']);
    }

    public function test_admin_can_delete_coupon()
    {
        $coupon = Coupon::factory()->create();

        $this->actingAs($this->adminUser())
            ->delete(route('admin.coupons.destroy', $coupon))
            ->assertRedirect(route('admin.coupons.index'));

        $this->assertDatabaseMissing('coupons', ['id' => $coupon->id]);
    }

    public function test_guest_cannot_access_coupons()
    {
        $this->get(route('admin.coupons.index'))->assertRedirect(route('login'));
    }
}
