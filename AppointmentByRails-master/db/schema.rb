# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_11_24_083511) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "appointment_products", force: :cascade do |t|
    t.bigint "appointment_id", null: false
    t.bigint "product_id", null: false
    t.integer "quantity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["appointment_id"], name: "index_appointment_products_on_appointment_id"
    t.index ["product_id"], name: "index_appointment_products_on_product_id"
  end

  create_table "appointments", force: :cascade do |t|
    t.bigint "employee_id", null: false
    t.bigint "service_id", null: false
    t.datetime "appointment_date"
    t.string "status", default: "confirmed"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_appointments_on_employee_id"
    t.index ["service_id"], name: "index_appointments_on_service_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true
  end

  create_table "employee_services", force: :cascade do |t|
    t.bigint "employee_id", null: false
    t.bigint "service_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_employee_services_on_employee_id"
    t.index ["service_id"], name: "index_employee_services_on_service_id"
  end

  create_table "employees", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password_digest"
    t.string "phone_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "authentication_token"
    t.bigint "role_id", null: false
    t.index ["authentication_token"], name: "index_employees_on_authentication_token", unique: true
    t.index ["role_id"], name: "index_employees_on_role_id"
  end

  create_table "inventory_logs", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.integer "change", null: false
    t.string "reason", null: false
    t.bigint "appointment_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["appointment_id"], name: "index_inventory_logs_on_appointment_id"
    t.index ["product_id"], name: "index_inventory_logs_on_product_id"
  end

  create_table "products", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.decimal "price"
    t.integer "stock"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "low_stock_threshold"
    t.bigint "category_id", null: false
    t.index ["category_id"], name: "index_products_on_category_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_roles_on_name", unique: true
  end

  create_table "services", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.decimal "price"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "duration"
    t.bigint "category_id", null: false
    t.index ["category_id"], name: "index_services_on_category_id"
  end

  add_foreign_key "appointment_products", "appointments"
  add_foreign_key "appointment_products", "products"
  add_foreign_key "appointments", "employees"
  add_foreign_key "appointments", "services"
  add_foreign_key "employee_services", "employees"
  add_foreign_key "employee_services", "services"
  add_foreign_key "employees", "roles"
  add_foreign_key "inventory_logs", "appointments"
  add_foreign_key "inventory_logs", "products"
  add_foreign_key "products", "categories"
  add_foreign_key "services", "categories"
end
