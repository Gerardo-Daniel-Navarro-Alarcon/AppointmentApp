# test/models/appointment_test.rb
require 'test_helper'

class AppointmentTest < ActiveSupport::TestCase
  test "no permite crear una cita si el empleado no está disponible" do
    employee = employees(:one)
    service = services(:one)
    appointment1 = Appointment.create(employee: employee, service: service, appointment_date: "2024-11-01 10:00:00")
    appointment2 = Appointment.new(employee: employee, service: service, appointment_date: "2024-11-01 10:30:00") # Conflicto de horario
    assert_not appointment2.save, "Se creó una cita en un horario conflictivo"
  end

  test "no permite crear una cita si el servicio está inactivo" do
    service = services(:inactive) # Servicio inactivo
    appointment = Appointment.new(service: service, appointment_date: "2024-11-01 10:00:00")
    assert_not appointment.save, "Se creó una cita con un servicio inactivo"
  end
end
