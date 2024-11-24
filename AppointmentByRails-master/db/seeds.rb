# db/seeds.rb

# Elimina todos los registros anteriores para evitar duplicados
Employee.destroy_all
Service.destroy_all
Product.destroy_all
Appointment.destroy_all
AppointmentProduct.destroy_all
EmployeeService.destroy_all

# Crea empleados
employee1 = Employee.create!(
  first_name: "Gerardo",
  last_name: "Navarro",
  email: "gerardo@example.com",
  password_digest: "123456",
  role: "admin",
  phone_number: "1234567890"
)

employee2 = Employee.create!(
  first_name: "Carlos",
  last_name: "Pérez",
  email: "carlos@example.com",
  password_digest: "abcdef",
  role: "barber",
  phone_number: "9876543210"
)

# Crea servicios
service1 = Service.create!(
  name: "Corte de Cabello",
  description: "Corte clásico para caballero",
  category: "Barbería",
  price: 200.00,
  active: true
)

service2 = Service.create!(
  name: "Afeitado Completo",
  description: "Afeitado y cuidado facial",
  category: "Barbería",
  price: 150.00,
  active: true
)

# Relación entre empleados y servicios
EmployeeService.create!(employee: employee2, service: service1)
EmployeeService.create!(employee: employee2, service: service2)

# Crea productos
product1 = Product.create!(
  name: "Cera para Cabello",
  description: "Cera moldeadora de alta fijación",
  price: 120.00,
  stock: 50,
  active: true
)

product2 = Product.create!(
  name: "Loción para Afeitar",
  description: "Loción refrescante para después del afeitado",
  price: 80.00,
  stock: 30,
  active: true
)

# Crea citas
appointment1 = Appointment.create!(
  employee: employee2,
  service: service1,
  appointment_date: DateTime.now + 1.day,
  status: "pendiente",
  notes: "Cliente nuevo, quiere un corte clásico"
)

appointment2 = Appointment.create!(
  employee: employee2,
  service: service2,
  appointment_date: DateTime.now + 2.days,
  status: "confirmada",
  notes: "Afeitado completo con cuidado facial"
)

# Relación entre citas y productos
AppointmentProduct.create!(appointment: appointment1, product: product1, quantity: 2)
AppointmentProduct.create!(appointment: appointment2, product: product2, quantity: 1)

puts "Datos de ejemplo insertados correctamente."
