# db/seeds.rb

# Elimina todos los registros anteriores para evitar duplicados
AppointmentProduct.destroy_all
Appointment.destroy_all
EmployeeService.destroy_all
Product.destroy_all
Service.destroy_all
Category.destroy_all
Employee.destroy_all
Role.destroy_all

# 1. Crear Roles
admin_role = Role.create!(name: "admin")
shipper_role = Role.create!(name: "shipper")
warehouse_manager_role = Role.create!(name: "warehouse_manager")
logistics_coordinator_role = Role.create!(name: "logistics_coordinator")

# 2. Crear Empleados
Employee.create!(
  first_name: "Ana",
  last_name: "García",
  email: "ana.garcia@yesera.com",
  password: "password123",
  role_id: admin_role.id,
  phone_number: "5551234567"
)

Employee.create!(
  first_name: "Luis",
  last_name: "Martínez",
  email: "luis.martinez@yesera.com",
  password: "password123",
  role_id: shipper_role.id,
  phone_number: "5559876543"
)

Employee.create!(
  first_name: "María",
  last_name: "Rodríguez",
  email: "maria.rodriguez@yesera.com",
  password: "password123",
  role: warehouse_manager_role,
  phone_number: "5553456789"
)

Employee.create!(
  first_name: "Carlos",
  last_name: "López",
  email: "carlos.lopez@yesera.com",
  password: "password123",
  role: logistics_coordinator_role,
  phone_number: "5554567890"
)

# 3. Crear Categorías de Productos
category_residenciales = Category.create!(name: "Ladrillos Residenciales")
category_comerciales = Category.create!(name: "Ladrillos Comerciales")
category_industriales = Category.create!(name: "Ladrillos Industriales")
category_constructivos = Category.create!(name: "Materiales de Construcción")
category_accesorios = Category.create!(name: "Accesorios de Embarque")
logistics_category = Category.find_or_create_by!(name: "Logística")

# 4. Crear Productos
Product.create!(
  name: "Ladrillo Rojo estándar",
  description: "Ladrillo rojo de alta calidad para construcciones residenciales.",
  category: category_residenciales,
  price: 0.50,
  stock: 10000,
  active: true
)

Product.create!(
  name: "Ladrillo Comercial reforzado",
  description: "Ladrillo comercial con refuerzo para mayor durabilidad.",
  category: category_comerciales,
  price: 0.75,
  stock: 8000,
  active: true
)

Product.create!(
  name: "Ladrillo Industrial pesado",
  description: "Ladrillo industrial diseñado para estructuras de gran tamaño.",
  category: category_industriales,
  price: 1.00,
  stock: 5000,
  active: true
)

Product.create!(
  name: "Cemento Portland",
  description: "Cemento de alta resistencia para diversas aplicaciones constructivas.",
  category: category_constructivos,
  price: 7.50,
  stock: 2000,
  active: true
)

Product.create!(
  name: "Paleta de Pintor",
  description: "Herramienta fundamental para el acabado de paredes.",
  category: category_accesorios,
  price: 3.00,
  stock: 1500,
  active: true
)

Product.create!(
  name: "Cinta Adhesiva de Envío",
  description: "Cinta resistente para asegurar paquetes durante el transporte.",
  category: category_accesorios,
  price: 1.20,
  stock: 3000,
  active: true
)

# 5. Crear Servicios de Envío
Service.create!(
  name: "Envío Nacional",
  description: "Servicio de envío a nivel nacional con seguimiento en tiempo real.",
  category: logistics_category,
  price: 50.00,
  duration: 2,
  active: true
)

Service.create!(
  name: "Envío Internacional",
  description: "Servicio de envío internacional con documentación personalizada.",
  category: logistics_category,
  price: 150.00,
  duration: 5, # Añade el atributo duration si es necesario
  active: true
)

Service.create!(
  name: "Recogida en Almacén",
  description: "Servicio de recogida de productos directamente desde el almacén.",
  category: logistics_category,
  price: 30.00,
  duration: 1, # Añade el atributo duration si es necesario
  active: true
)

# 6. Asociar Empleados con Servicios
EmployeeService.create!(employee: Employee.find_by(email: "luis.martinez@yesera.com"), service: Service.find_by(name: "Envío Nacional"))
EmployeeService.create!(employee: Employee.find_by(email: "carlos.lopez@yesera.com"), service: Service.find_by(name: "Envío Internacional"))
EmployeeService.create!(employee: Employee.find_by(email: "ana.garcia@yesera.com"), service: Service.find_by(name: "Recogida en Almacén"))

# 7. Crear Citas de Embarque (Appointments)
appointment1 = Appointment.create!(
  employee: Employee.find_by(email: "luis.martinez@yesera.com"),
  service: Service.find_by(name: "Envío Nacional"),
  appointment_date: DateTime.now + 1.day,
  status: "pendiente",
  notes: "Envío de 5000 ladrillos rojos estándar a Ciudad de México."
)

appointment2 = Appointment.create!(
  employee: Employee.find_by(email: "carlos.lopez@yesera.com"),
  service: Service.find_by(name: "Envío Internacional"),
  appointment_date: DateTime.now + 2.days,
  status: "confirmada",
  notes: "Envío de 2000 ladrillos industriales a USA."
)

appointment3 = Appointment.create!(
  employee: Employee.find_by(email: "ana.garcia@yesera.com"),
  service: Service.find_by(name: "Recogida en Almacén"),
  appointment_date: DateTime.now + 3.days,
  status: "completada",
  notes: "Recogida de materiales de construcción para proyecto XYZ."
)

# 8. Asociar Productos con Citas de Embarque
AppointmentProduct.create!(appointment: appointment1, product: Product.find_by(name: "Ladrillo Rojo estándar"), quantity: 5000)
AppointmentProduct.create!(appointment: appointment2, product: Product.find_by(name: "Ladrillo Industrial pesado"), quantity: 2000)
AppointmentProduct.create!(appointment: appointment3, product: Product.find_by(name: "Cemento Portland"), quantity: 300)
AppointmentProduct.create!(appointment: appointment3, product: Product.find_by(name: "Paleta de Pintor"), quantity: 50)

# 9. Crear Logs de Inventario (Opcional)
# Esto asume que existe un modelo InventoryLog con los campos apropiados
# InventoryLog.create!(
#   product: Product.find_by(name: "Ladrillo Rojo estándar"),
#   change: -5000,
#   reason: "Envío Nacional",
#   appointment: appointment1
# )

# 10. Mensaje de Confirmación
puts "Datos de ejemplo insertados correctamente para el área de embarques de una yesera."