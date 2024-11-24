# app/controllers/appointments_controller.rb
class AppointmentsController < ApplicationController
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
  before_action :set_appointment, only: %i[show edit update destroy]

  # GET /appointments or /appointments.json
  def index
    @appointments = Appointment.all
    respond_to do |format|
      format.html # Renderiza la vista index.html.erb
      format.json { render json: @appointments }
    end
  end

  # GET /appointments/1 or /appointments/1.json
  def show
    respond_to do |format|
      format.html # Renderiza la vista show.html.erb
      format.json { render json: @appointment }
    end
  end

  # GET /appointments/new
  def new
    @appointment = Appointment.new
    @employees = Employee.all
    @services = Service.where(active: true)
    @products = Product.where(active: true)
  end

  def edit
    @appointment = Appointment.find(params[:id])
    @employees = Employee.all
    @services = Service.where(active: true)
    @products = Product.where(active: true)
    @selected_products = @appointment.products.pluck(:id)
  end

  # POST /appointments or /appointments.json
  def create
    @appointment = Appointment.new(appointment_params)
    respond_to do |format|
      if @appointment.save
        # Asocia productos si se seleccionaron
        if params[:appointment][:product_ids].present?
          params[:appointment][:product_ids].each do |product_id|
            @appointment.appointment_products.create!(product_id: product_id, quantity: 1) # Ajusta la cantidad según sea necesario
          end
        end
        format.html { redirect_to @appointment, notice: 'La cita fue creada exitosamente.' }
        format.json { render :show, status: :created, location: @appointment }
      else
        format.html do
          flash.now[:alert] = @appointment.errors.full_messages.join(", ")
          render :new, status: :unprocessable_entity
        end
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /appointments/1 or /appointments/1.json
  def update
    respond_to do |format|
      if @appointment.update(appointment_params)
        # Actualiza asociaciones de productos
        @appointment.appointment_products.destroy_all
        if params[:appointment][:product_ids].present?
          params[:appointment][:product_ids].each do |product_id|
            @appointment.appointment_products.create!(product_id: product_id, quantity: 1) # Ajusta la cantidad según sea necesario
          end
        end
        format.html { redirect_to @appointment, notice: 'La cita fue actualizada exitosamente.' }
        format.json { render :show, status: :ok, location: @appointment }
      else
        format.html do
          flash.now[:alert] = @appointment.errors.full_messages.join(", ")
          render :edit, status: :unprocessable_entity
        end
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /appointments/1 or /appointments/1.json
  def destroy
    @appointment.destroy!
    respond_to do |format|
      format.html { redirect_to appointments_url, notice: 'La cita fue eliminada exitosamente.', status: :see_other }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_appointment
    @appointment = Appointment.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.html { redirect_to appointments_url, alert: 'Cita no encontrada.' }
      format.json { render json: { error: 'Cita no encontrada' }, status: :not_found }
    end
  end

  # Only allow a list of trusted parameters through.
  def appointment_params
    params.require(:appointment).permit(:employee_id, :service_id, :appointment_date, :status, :notes, product_ids: [])
  end
  
end

# app/controllers/products_controller.rb

def new
  @product = Product.new
  @categories = Category.all
end

def edit
  @categories = Category.all
end
