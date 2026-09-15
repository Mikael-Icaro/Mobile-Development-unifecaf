import axios from 'axios';

export const MALE_CATEGORIES = ['mens-shirts', 'mens-shoes', 'mens-watches'];
export const FEMALE_CATEGORIES = [
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
  'womens-watches',
];

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

export async function fetchProductsByCategories(categories) {
  const responses = await Promise.all(
    categories.map((category) => api.get(`/products/category/${category}`))
  );
  return responses.flatMap((response) => response.data.products);
}

export async function fetchProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export default api;
