# app/models/category.rb
class Category < ApplicationRecord
  has_many :products, dependent: :restrict_with_error
  has_many :services, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true
end