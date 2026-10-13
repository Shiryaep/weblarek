import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { ProductModel } from "./components/models/ProductModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { WebLarekApi } from "./components/WebLarekApi";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

// import Views
import { Gallery } from "./components/views/Gallery";
import { Header } from "./components/views/Header";
import { Modal } from "./components/views/Modal";
import { CardCatalog } from "./components/views/CardCatalog";
import { CardPreview } from "./components/views/CardPreview";
import { CardBasket } from "./components/views/CardBasket";
import { Basket } from "./components/views/Basket";
import { IOrderFormData, OrderForm } from "./components/views/OrderForm";
import {
  ContactsForm,
  IContactsFormData,
} from "./components/views/ContactForm";
import { Success } from "./components/views/Success";
import { IProduct, TPayment } from "./types";

const events = new EventEmitter();
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);
const apiBase = new Api(API_URL, settings);
const api = new WebLarekApi(apiBase);

const galleryElem = new Gallery(ensureElement<HTMLElement>(".gallery", this));
const header = new Header(
  ensureElement<HTMLElement>(".header__container", this),
  { onClick: () => events.emit("basket:opened") },
);
const modal = new Modal(ensureElement<HTMLElement>(".modal"));

const orderForm = new OrderForm(
  events,
  cloneTemplate<HTMLFormElement>("#order"),
);
const contactsForm = new ContactsForm(
  events,
  cloneTemplate<HTMLFormElement>("#contacts"),
);
const success = new Success(cloneTemplate<HTMLFormElement>("#success"), {
  onClose: () => {
    modal.close();
    events.emit("catalog:open");
  },
});

const basket = new Basket(cloneTemplate<HTMLElement>("#basket"), {
  onCheckout: () => events.emit("order:open"),
});

api
  .getProductList()
  .then((response) => {
    console.log("Ответ сервера на GET /product/:", response);
    productModel.setItems(response.items);
  })
  .catch((err) => {
    console.error("Ошибка при получении товаров с сервера:", err);
  });
const cardPreview = new CardPreview(
  cloneTemplate<HTMLElement>("#card-preview"),
  {
    onClick: () => {
      events.emit("preview:click");
    },
  },
);

// Event Handlers

events.on("product:changed", () => {
  const cards = productModel.getItems().map((item) =>
    new CardCatalog(cloneTemplate<HTMLElement>("#card-catalog"), {
      onClick: () => events.emit("cardCatalog:selected", item),
    }).render({
      title: item.title,
      category: item.category,
      price: item.price,
      image: `${CDN_URL}${item.image}`,
    }),
  );

  galleryElem.render({ items: cards });
});

events.on("cardCatalog:selected", (item: IProduct) => {
  productModel.setPreview(item.id);
});

events.on("productPreview:changed", () => {
  const currentItem = productModel.getPreview();
  if (currentItem !== null) {
    const isInBasket = basketModel.hasItem(currentItem.id);

    modal.render({
      content: cardPreview.render({
        title: currentItem.title,
        description: currentItem.description,
        category: currentItem.category,
        price: currentItem.price,
        image: `${CDN_URL}${currentItem.image}`,
        isDisabled: currentItem.price === null,
        buttonText:
          currentItem.price === null
            ? "Недоступно"
            : isInBasket
              ? "Удалить из корзины"
              : "Купить",
      }),
    });
  }
});

events.on("preview:click", () => {
  const currentItem = productModel.getPreview();
  if (currentItem !== null) {
    if (currentItem.price !== null) {
      if (basketModel.hasItem(currentItem.id)) {
        basketModel.removeItem(currentItem.id);
      } else {
        basketModel.addItem(currentItem);
      }
    }
    modal.close();
  }
});

events.on("basket:changed", () => {
  header.render({ counter: basketModel.getCount() });
  const items = basketModel.getItems();

  const cards = items.map((item, index) =>
    new CardBasket(cloneTemplate<HTMLElement>("#card-basket"), {
      onClick: () => {
        basketModel.removeItem(item.id);
        events.emit("basket:opened");
      },
    }).render({
      title: item.title,
      category: item.category,
      price: item.price,
      index: index + 1,
    }),
  );

  basket.render({
    items: cards,
    total: basketModel.getTotalPrice(),
  });
});

events.on("cardPreview:buttonClicked", (item: IProduct) => {
  basketModel.addItem(item);
  modal.close();
});

events.on("basket:opened", () => {
  modal.render({
    content: basket.render(),
  });
});

events.on("order:open", () => {
  modal.render({
    content: orderForm.render(),
  });
});

events.on(
  "order:change",
  (data: { field: keyof IOrderFormData; value: string }) => {
    if (data.field === "payment") buyerModel.setPayment(data.value as TPayment);
    if (data.field === "address") buyerModel.setAddress(data.value);
  },
);

events.on("order:submit", () => {
  modal.render({ content: contactsForm.render() });
});

events.on(
  "contacts:change",
  (data: { field: keyof IContactsFormData; value: string }) => {
    if (data.field === "email") buyerModel.setEmail(data.value);
    if (data.field === "phone") buyerModel.setPhone(data.value);
  },
);

events.on("contacts:submit", () => {
  const orderData = {
    ...buyerModel.getData(),
    total: basketModel.getTotalPrice(),
    items: basketModel.getItems().map((item) => item.id),
  };

  api
    .createOrder(orderData)
    .then((result) => {
      basketModel.clear();
      buyerModel.clear();

      modal.render({ content: success.render({ total: result.total }) });
    })
    .catch((err) => {
      contactsForm.render({
        valid: false,
        errors: "Ошибка при оплате. Попробуйте позже.",
      });
    });
});

events.on("buyer:changed", () => {
  const errors = buyerModel.validate();
  const isFirstValid = !errors.payment && !errors.address;
  const isFullyValid =
    !errors.payment && !errors.address && !errors.email && !errors.phone;

  orderForm.render({
    payment: buyerModel.getData().payment,
    address: buyerModel.getData().address,
    valid: isFirstValid,
    errors: errors.payment || errors.address || "",
  });

  contactsForm.render({
    email: buyerModel.getData().email,
    phone: buyerModel.getData().phone,
    valid: isFullyValid,
    errors: errors.email || errors.phone || "",
  });
});

events.on("modal:close", () => {
  buyerModel.clear();
  orderForm.render({ valid: false, errors: "", payment: "", address: "" });
  contactsForm.render({ valid: false, errors: "", email: "", phone: "" });
});
