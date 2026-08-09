export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TConstructorIngredient = TIngredient & {
  constructorId: string;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TCreateOrderRequest = {
  ingredients: string[];
};

export type TCreateOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type TOrderStatus = 'created' | 'done' | 'pending';

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: TOrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

export type TOrdersResponse = TBaseResponse & {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TOrderResponse = TBaseResponse & {
  order: TOrder;
};

export type TUser = {
  email: string;
  name: string;
};

export type TAuthRequest = {
  email: string;
  password: string;
};

export type TRegisterRequest = TAuthRequest & {
  name: string;
};

export type TUpdateUserRequest = Partial<TRegisterRequest>;

export type TForgotPasswordRequest = {
  email: string;
};

export type TResetPasswordRequest = {
  password: string;
  token: string;
};

export type TBaseResponse = {
  success: boolean;
};

export type TAuthResponse = TBaseResponse & {
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export type TRefreshTokenResponse = TBaseResponse & {
  accessToken: string;
  refreshToken: string;
};

export type TUserResponse = TBaseResponse & {
  user: TUser;
};

export type TMessageResponse = TBaseResponse & {
  message: string;
};
