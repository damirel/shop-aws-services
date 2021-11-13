interface IEnvConfig {
  PORT: string;
  NODE_ENV: string;
  PRODUCT_SERVICE: string;
  CART_SERVICE: string;
}

declare const process: {
  env: IEnvConfig;
};

export default (): IEnvConfig => ({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  PRODUCT_SERVICE: process.env.PRODUCT_SERVICE,
  CART_SERVICE: process.env.CART_SERVICE,
});