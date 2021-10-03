
export const getProductFromRequest = (record) => {
  const {title, description, price, count} = record;
  return {
    title: title,
    description: description,
    price: price,
    count: count
  };
};