# app/controllers/products_controller.rb
class ProductsController < ApplicationController
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
  before_action :set_product, only: %i[show edit update destroy]

  # GET /products or /products.json
  def index
    @products = Product.all
    respond_to do |format|
      format.html # Renderiza la vista index.html.erb
      format.json { render json: @products }
    end
  end

  # GET /products/low_stock
  def low_stock
    threshold = 5 # Puedes definir un valor predeterminado o hacer que sea configurable
    @low_stock_products = Product.where("stock < ?", threshold)
    respond_to do |format|
      format.html # Renderiza la vista low_stock.html.erb
      format.json { render json: @low_stock_products }
    end
  end

  # GET /products/1 or /products/1.json
  def show
    respond_to do |format|
      format.html # Renderiza la vista show.html.erb
      format.json { render json: @product }
    end
  end

  # GET /products/new
  def new
    @product = Product.new
    @categories = Category.all
  end

  # GET /products/1/edit
  def edit
    @categories = Category.all
  end

  # POST /products or /products.json
  def create
    @product = Product.new(product_params)
    respond_to do |format|
      if @product.save
        format.html { redirect_to @product, notice: 'Producto creado exitosamente.' }
        format.json { render :show, status: :created, location: @product }
      else
        @categories = Category.all
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/1 or /products/1.json
  def update
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to @product, notice: 'Producto actualizado exitosamente.' }
        format.json { render :show, status: :ok, location: @product }
      else
        @categories = Category.all
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1 or /products/1.json
  def destroy
    @product.destroy!
    respond_to do |format|
      format.html { redirect_to products_url, notice: 'Product was successfully destroyed.', status: :see_other }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_product
    @product = Product.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def product_params
    params.require(:product).permit(:name, :description, :price, :stock, :active, :category_id)
  end
end
