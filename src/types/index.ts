export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// Интерфейсы для классов данных
export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IProductItemResponse extends IProduct {
  error?: string;
}

// Ответ сервера на GET /product/
export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

// Ответ сервера на POST /order/
export interface IOrderResult {
  id?: string;
  total?: number;
  error?: string;
}
