# app/controllers/services_controller.rb
class ServicesController < ApplicationController
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
  before_action :set_service, only: %i[show edit update destroy]

  # GET /services or /services.json
  def index
    @services = Service.all
    respond_to do |format|
      format.html # Renderiza la vista index.html.erb
      format.json { render json: @services }
    end
  end

  # GET /services/1 or /services/1.json
  def show
    respond_to do |format|
      format.html # Renderiza la vista show.html.erb
      format.json { render json: @service }
    end
  end

  # GET /services/new
  def new
    @service = Service.new
    @categories = Category.all
  end

  # GET /services/1/edit
  def edit
    @categories = Category.all
  end

  # POST /services or /services.json
  def create
    @service = Service.new(service_params)
    respond_to do |format|
      if @service.save
        format.html { redirect_to @service, notice: 'Servicio creado exitosamente.' }
        format.json { render :show, status: :created, location: @service }
      else
        @categories = Category.all
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @service.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /services/1 or /services/1.json
  def update
    respond_to do |format|
      if @service.update(service_params)
        format.html { redirect_to @service, notice: 'Service was successfully updated.' }
        format.json { render :show, status: :ok, location: @service }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @service.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /services/1 or /services/1.json
  def destroy
    @service.destroy!
    respond_to do |format|
      format.html { redirect_to services_url, notice: 'Service was successfully destroyed.', status: :see_other }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_service
    @service = Service.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.html { redirect_to services_url, alert: 'Service not found.' }
      format.json { render json: { error: 'Service not found' }, status: :not_found }
    end
  end

  # Only allow a list of trusted parameters through.
  def service_params
    params.require(:service).permit(:name, :description, :category_id, :price, :duration, :active)
  end
end
