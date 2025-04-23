export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export function normalizeProductDates(product: Product): Product {
  return {
    ...product,
    date_release: formatDate(new Date(product.date_release)),
    date_revision: formatDate(new Date(product.date_revision)),
  };
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}