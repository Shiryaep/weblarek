import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { ProductModel } from "./components/models/ProductModel";
import { BasketModel } from "./components/models/BasketModel";
import { OrderModel } from "./components/models/OrderModel";
import { apiProducts } from "./utils/data";
import { IProduct, TPayment } from "./types";

// Создаём брокер событий (из готового кода)
const events = new EventEmitter();

// Подписываемся на события для тестиков
events.on("products:changed", (data: { items: IProduct[] }) => {
  console.log(
    "[Event (products:changed) случился] — товаров в каталоге:",
    data.items.length,
  );
});
events.on("preview:changed", (data: { product: IProduct | null }) => {
  console.log(
    "[Event (preview:changed) случился] — выбран товар:",
    data.product?.title,
  );
});
events.on("basket:changed", (data: { items: IProduct[] }) => {
  console.log(
    "[Event (basket:changed) случился] — товаров в корзине:",
    data.items.length,
  );
});
events.on("order:paymentChanged", (data: { payment: TPayment }) => {
  console.log(
    "[Event (order:paymentChanged) случился] — способ оплаты:",
    data.payment,
  );
});
events.on("order:addressChanged", (data: { address: string }) => {
  console.log("[Event (order:addressChanged) случился] — адрес:", data.address);
});
events.on("order:phoneChanged", (data: { phone: string }) => {
  console.log("[Event (order:phoneChanged) случился] — телефон:", data.phone);
});
events.on("order:emailChanged", (data: { email: string }) => {
  console.log("[Event (order:emailChanged) случился] — email:", data.email);
});
events.on("order:cleared", () => {
  console.log("[Event (order:cleared) случился] — данные покупателя очищены");
});

// Создаём экземпляры моделей
console.log("=== ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ ===");

const productsModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

//Методы для каталога
console.log("\n=== ПРОВЕРКА ProductModel (Каталог товаров) ===");

// 1. setItems — сохранение массива товаров
productsModel.setItems(apiProducts.items);
console.log(
  "Массив товаров из каталога после setItems:",
  productsModel.getItems(),
);

// 2. getItems — получение массива товаров
console.log("Количество товаров в каталоге:", productsModel.getItems().length);

// 3. getProductById — получение товара по id
const firstProductId = apiProducts.items[0].id;
console.log(
  `Товар по id ${firstProductId}:`,
  productsModel.getProductById(firstProductId),
);
console.log(
  'Товар по несуществующему id "unknown":',
  productsModel.getProductById("unknown"),
);

// 4. setPreview — сохранение товара для подробного отображения
productsModel.setPreview(firstProductId);

// 5. getPreview — получение товара для подробного отображения
console.log(
  "Товар для подробного отображения (preview):",
  productsModel.getPreview(),
);

//Методы для корзины
console.log("\n=== ПРОВЕРКА BasketModel (Корзина) ===");

// 1. getItems — получение пустой корзины
console.log("Корзина до добавления товаров:", basketModel.getItems());

// 2. addItem — добавление товара
const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];
const product3 = apiProducts.items[2];
basketModel.addItem(product1);
basketModel.addItem(product2);
basketModel.addItem(product3);
console.log("Корзина после добавления 3 товаров:", basketModel.getItems());

// 3. hasItem — проверка наличия товара
console.log(
  `Товар ${product1.id} есть в корзине?`,
  basketModel.hasItem(product1.id),
);
console.log(
  'Несуществующий товар "unknown" в корзине?',
  basketModel.hasItem("unknown"),
);

// 4. getCount — количество товаров
console.log("Количество товаров в корзине:", basketModel.getCount());

// 5. getTotalPrice — общая стоимость
console.log("Общая стоимость товаров в корзине:", basketModel.getTotalPrice());

// 6. Повторное добавление того же товара (не должно добавиться)
basketModel.addItem(product1);
console.log(
  "Количество товаров после попытки повторного добавления:",
  basketModel.getCount(),
);

// 7. removeItem — удаление товара
basketModel.removeItem(product2.id);
console.log("Корзина после удаления второго товара:", basketModel.getItems());
console.log("Количество товаров после удаления:", basketModel.getCount());

// 8. clear — очистка корзины
basketModel.clear();
console.log("Корзина после очистки:", basketModel.getItems());
console.log("Количество товаров после очистки:", basketModel.getCount());

//Методы для покупателя
console.log("\n=== ПРОВЕРКА OrderModel (Покупатель) ===");

// 1. setPayment — сохранение вида оплаты
orderModel.setPayment("online");

// 2. setAddress — сохранение адреса
orderModel.setAddress("г. Москва, улица Пушкина, дом Колотушкина");

// 3. setPhone — сохранение телефона
orderModel.setPhone("+7 (000) 123-45-67");

// 4. setEmail — сохранение email
orderModel.setEmail("test@yandex.ru");

// 5. getData — получение всех данных
console.log("Все данные покупателя:", orderModel.getData());

// 6. validate — валидация заполненных данных (должна вернуть null)
console.log("Валидация заполненных данных:", orderModel.validate());

// 7. Проверка частичной валидации — очищаем email и payment
orderModel.setPayment(null as unknown as TPayment);
(orderModel as any)._email = "";
console.log("Валидация после очистки email и payment:", orderModel.validate());

// 8. Полная очистка данных
orderModel.clear();
console.log("Данные покупателя после очистки:", orderModel.getData());
// 9. Проветка полностью невалидных данных
console.log("Валидация после полной очистки:", orderModel.validate());
console.log("\n=== ПРОВЕРКА ЗАВЕРШЕНА ===");
