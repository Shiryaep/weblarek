import "./scss/styles.scss";
import { ProductModel } from "./components/models/ProductModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { WebLarekApi } from "./components/WebLarekApi";
import { apiProducts } from "./utils/data";
import { API_URL, settings } from "./utils/constants";
import { Api } from "./components/base/Api";

// Создаём экземпляры моделей
console.log("=== ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ ===");

const productsModel = new ProductModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel(null, "", "", "");

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
buyerModel.setPayment("cash");

// 2. setAddress — сохранение адреса
buyerModel.setAddress("г. Москва, улица Пушкина, дом Колотушкина");

// 3. setPhone — сохранение телефона
buyerModel.setPhone("+7 (000) 123-45-67");

// 4. setEmail — сохранение email
buyerModel.setEmail("test@yandex.ru");

// 5. getData — получение всех данных
console.log("Все данные покупателя:", buyerModel.getData());

// 6. validate — валидация заполненных данных (должна вернуть null)
console.log("Валидация заполненных данных:", buyerModel.validate());

// 7. Проверка частичной валидации — очищаем email и payment
buyerModel.setPayment(null);
buyerModel.setEmail('');
console.log("Валидация после очистки email и payment:", buyerModel.validate());

// 8. Полная очистка данных
buyerModel.clear();
console.log("Данные покупателя после очистки:", buyerModel.getData());
// 9. Проветка полностью невалидных данных
console.log("Валидация после полной очистки:", buyerModel.validate());
console.log("\n=== ПРОВЕРКА ЗАВЕРШЕНА ===");

//
// === РАБОТА С СЕРВЕРОМ ===
//
console.log("\n=== ПРОВЕРКА СЛОЯ КОММУНИКАЦИИ (WebLarekApi) ===");

// Создаём экземпляр нашего конкретного Api-клиента
const apiBase = new Api(API_URL, settings);
const api = new WebLarekApi(apiBase);

// Выполняем запрос на сервер для получения списка товаров
api
  .getProductList()
  .then((response) => {
    console.log("Ответ сервера на GET /product/:", response);
    // Сохраняем полученный массив товаров в модели каталога
    productsModel.setItems(response.items);
    console.log(
      "Каталог товаров, полученный с сервера:",
      productsModel.getItems(),
    );
    console.log(
      "Количество товаров в каталоге:",
      productsModel.getItems().length,
    );
  })
  .catch((err) => {
    console.error("Ошибка при получении товаров с сервера:", err);
  });
