import { faker } from "@faker-js/faker";

const { commerce, random, datatype, image } = faker;

export const generateProduct = () => {
  return {
    title: commerce.product(),
    description: commerce.productDescription().toLowerCase(),
    price: parseFloat(commerce.price()),
    code: random.alphaNumeric(3),
    stock: parseInt(random.numeric()),
    status: datatype.boolean(),
    category: commerce.productAdjective(),
    thumbnail: image.imageUrl(),
  };
};
