require "application_system_test_case"

class AppointmentsTest < ApplicationSystemTestCase
  setup do
    @appointment = appointments(:one)
  end

  test "visiting the index" do
    visit appointments_url
    assert_selector "h1", text: "Appointments"
  end

  test "should create appointment" do
    visit appointments_url
    click_on "New appointment"

    fill_in "Appointment date", with: @appointment.appointment_date
    fill_in "Created at", with: @appointment.created_at
    fill_in "Employee", with: @appointment.employee_id
    fill_in "Notes", with: @appointment.notes
    fill_in "Service", with: @appointment.service_id
    fill_in "Status", with: @appointment.status
    fill_in "Updated at", with: @appointment.updated_at
    click_on "Create Appointment"

    assert_text "Appointment was successfully created"
    click_on "Back"
  end

  test "should update Appointment" do
    visit appointment_url(@appointment)
    click_on "Edit this appointment", match: :first

    fill_in "Appointment date", with: @appointment.appointment_date.to_s
    fill_in "Created at", with: @appointment.created_at.to_s
    fill_in "Employee", with: @appointment.employee_id
    fill_in "Notes", with: @appointment.notes
    fill_in "Service", with: @appointment.service_id
    fill_in "Status", with: @appointment.status
    fill_in "Updated at", with: @appointment.updated_at.to_s
    click_on "Update Appointment"

    assert_text "Appointment was successfully updated"
    click_on "Back"
  end

  test "should destroy Appointment" do
    visit appointment_url(@appointment)
    click_on "Destroy this appointment", match: :first

    assert_text "Appointment was successfully destroyed"
  end
end
