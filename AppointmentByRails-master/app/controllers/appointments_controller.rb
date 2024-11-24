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
  end

  # GET /appointments/1/edit
  def edit
  end

  # POST /appointments or /appointments.json
  def create
    @appointment = Appointment.new(appointment_params)
    respond_to do |format|
      if @appointment.save
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
    params.require(:appointment).permit(:employee_id, :service_id, :appointment_date, :status, :notes)
  end
  
end
