import { IApi, IOrder, IOrderResult, IProductListResponse } from "../types";

export class WebLarekApi {
  private api: IApi;

  constructor(api : IApi) {
    this.api = api;
  }

  // Получение списка товаров с сервера
  getProductList(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>("/product/");
  }

  // Отправка заказа на сервер
  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order/", order);
  }
}
