require "application_system_test_case"

class ProductsTest < ApplicationSystemTestCase
  setup do
    @product = products(:one)
  end

  test "visiting the index" do
    visit products_url
    assert_selector "h1", text: "Products"
  end

  test "should create product" do
    visit products_url
    click_on "New product"

    check "Active" if @product.active
    fill_in "Created at", with: @product.created_at
    fill_in "Description", with: @product.description
    fill_in "Name", with: @product.name
    fill_in "Price", with: @product.price
    fill_in "Stock", with: @product.stock
    fill_in "Updated at", with: @product.updated_at
    click_on "Create Product"

    assert_text "Product was successfully created"
    click_on "Back"
  end

  test "should update Product" do
    visit product_url(@product)
    click_on "Edit this product", match: :first

    check "Active" if @product.active
    fill_in "Created at", with: @product.created_at.to_s
    fill_in "Description", with: @product.description
    fill_in "Name", with: @product.name
    fill_in "Price", with: @product.price
    fill_in "Stock", with: @product.stock
    fill_in "Updated at", with: @product.updated_at.to_s
    click_on "Update Product"

    assert_text "Product was successfully updated"
    click_on "Back"
  end

  test "should destroy Product" do
    visit product_url(@product)
    click_on "Destroy this product", match: :first

    assert_text "Product was successfully destroyed"
  end
end
