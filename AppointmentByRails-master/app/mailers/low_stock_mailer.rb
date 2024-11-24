class LowStockMailer < ApplicationMailer
  def notify(product)
    @product = product
    mail(to: "202310351@itslerdo.edu.mx", subject: "Alerta de Inventario Bajo: #{product.name}")
  end
end
