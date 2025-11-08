import React, { useState, useEffect } from "react";

const FAKE_SERVICES = [
  { _id: "1", name: "Thuê vợt", price: 5, type: "rental" },
  { _id: "2", name: "Thuê giày", price: 7, type: "rental" },
  { _id: "3", name: "Nước suối", price: 2, type: "sale" },
  { _id: "4", name: "Nước tăng lực", price: 3, type: "sale" },
  { _id: "5", name: "Bóng (1 ống)", price: 10, type: "sale" },
];

const CourtServiceModal = ({ isOpen, onClose, court, onSave }) => {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setServices(FAKE_SERVICES);
      setCart([]);
    }
  }, [isOpen]);

  if (!isOpen || !court) return null;

  const addToCart = (service) => {
    setCart((currentCart) => {
      const itemExists = currentCart.find((item) => item._id === service._id);
      if (itemExists) {
        return currentCart.map((item) =>
          item._id === service._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentCart, { ...service, quantity: 1 }];
      }
    });
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="border-b border-sky-200 bg-sky-50 p-4 text-xl font-semibold text-sky-900">
          Dịch vụ cho sân: {court.name}
        </h2>

        <div className="grid grid-cols-1 gap-5 bg-white p-4">

          <div>
            <h4 className="text-lg font-medium text-gray-700">Chọn dịch vụ:</h4>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {services.map((service) => (
                <button
                  key={service._id}
                  onClick={() => addToCart(service)}
                  className="rounded-lg bg-sky-50 px-3 py-3 text-center font-semibold text-sky-800 transition-colors hover:bg-sky-100"
                >
                  {service.name} (${service.price})
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-700">Giỏ hàng:</h4>
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              {cart.length === 0 ? (
                <div className="flex items-center justify-center py-4">
                  <p className="text-sm text-gray-500">Chưa có dịch vụ nào.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <span className="font-medium text-gray-800">
                          {item.name}
                        </span>
                        <span className="ml-2 text-gray-500">
                          x {item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>

        <div className="flex items-center justify-between border-t border-sky-100 bg-sky-50 p-4">
          <div>
            <span className="text-lg font-bold text-gray-900">Tổng cộng: </span>
            <span className="text-xl font-bold text-green-600">
              ${total.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-5 py-2.5 font-semibold text-gray-800 transition-colors hover:bg-gray-300"
            >
              Đóng
            </button>
            <button 
              onClick={() => onSave(court, cart)}
              className="rounded-lg bg-sky-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-sky-700"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtServiceModal;