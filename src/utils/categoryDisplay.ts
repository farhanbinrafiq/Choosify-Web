import type { CatalogCategory } from '../types/catalog';
import { CATEGORIES } from '../data/categories';
import { getCategoryImage } from '../lib/categoryImages';

export type CategorySubcategory = {
  name: string;
  count: number;
  brands: number;
  icon: string;
};

export type CategoryDisplayItem = {
  id: string;
  name: string;
  icon: string;
  count: number;
  image?: string;
  subcategories: CategorySubcategory[];
};

const SUBCATEGORY_PRESETS: Record<string, { names: string[]; icon: string }> = {
  'fashion & lifestyle': {
    names: ["Men's Wear", "Women's Wear", 'Footwear', 'Accessories', 'Ethnic Wear'],
    icon: 'Shirt',
  },
  'jewelry & accessories': {
    names: ['Gold Jewelry', 'Silver Jewelry', 'Watches', 'Bags', 'Sunglasses'],
    icon: 'Gem',
  },
  'mobile & phones': {
    names: ['Smartphones', 'Feature Phones', 'Cases', 'Chargers', 'Earbuds'],
    icon: 'Smartphone',
  },
  'tech & electronics': {
    names: ['Laptops', 'Audio', 'Cameras', 'Smart Home', 'Storage'],
    icon: 'Cpu',
  },
  'gaming & entertainment': {
    names: ['Consoles', 'PC Gaming', 'Games', 'Controllers', 'Streaming'],
    icon: 'Monitor',
  },
  'tv & appliances': {
    names: ['Televisions', 'Refrigerators', 'AC Units', 'Kitchen', 'Laundry'],
    icon: 'Tv',
  },
  'home & living': {
    names: ['Furniture', 'Decor', 'Kitchenware', 'Bedding', 'Lighting'],
    icon: 'Home',
  },
  'food & restaurants': {
    names: ['Groceries', 'Snacks', 'Beverages', 'Ready Meals', 'Organic'],
    icon: 'Utensils',
  },
  'baby & maternity': {
    names: ['Baby Clothing', 'Feeding', 'Diapers', 'Toys', 'Maternity'],
    icon: 'Baby',
  },
  'sporting & playstation': {
    names: ['Fitness', 'Outdoor', 'Team Sports', 'PlayStation', 'Cycling'],
    icon: 'Gamepad2',
  },
};

import type { CatalogProduct } from '../types/catalog';

function countProductsForCategory(products: CatalogProduct[], categoryName: string) {
  const needle = categoryName.toLowerCase();
  return products.filter((product) => {
    const category = String(product.categoryName ?? '').toLowerCase();
    return category === needle || category.includes(needle) || needle.includes(category);
  }).length;
}

function countBrandsForSlice(products: CatalogProduct[]) {
  const brands = new Set<string>();
  products.forEach((product) => {
    const brand = String(product.brandName ?? '').trim();
    if (brand) brands.add(brand.toLowerCase());
  });
  return Math.max(brands.size, 1);
}

function buildPresetSubcategories(
  categoryName: string,
  icon: string,
  products: CatalogProduct[],
): CategorySubcategory[] {
  const preset = SUBCATEGORY_PRESETS[categoryName.toLowerCase()];
  if (!preset) return [];

  const categoryProducts = products.filter((product) => {
    const category = String(product.categoryName ?? '').toLowerCase();
    return category.includes(categoryName.toLowerCase().split(' ')[0]);
  });

  return preset.names.map((subName, index) => {
    const sliceSize = Math.max(1, Math.floor((categoryProducts.length || categoryName.length) / preset.names.length));
    const count = sliceSize + (index % 3) * 2 + 4;
    return {
      name: subName,
      count,
      brands: Math.max(1, Math.min(12, Math.floor(count / 4))),
      icon: preset.icon || icon,
    };
  });
}

function mapChildCategories(
  parent: CatalogCategory,
  children: CatalogCategory[],
  products: CatalogProduct[],
): CategorySubcategory[] {
  return children.map((child) => {
    const childProducts = products.filter((product) => {
    const categoryId = String(product.categoryId ?? '');
    const categoryName = String(product.categoryName ?? '').toLowerCase();
      return categoryId === child.id || categoryName === child.name.toLowerCase();
    });

    return {
      name: child.name,
      count: childProducts.length || 8,
      brands: countBrandsForSlice(childProducts),
      icon: child.icon || 'Package',
    };
  });
}

export function buildCategoryDisplayList(
  allCategories: CatalogCategory[],
  allProducts: CatalogProduct[] = [],
): CategoryDisplayItem[] {
  if (allCategories.length > 0) {
    const roots = allCategories.filter((cat) => !cat.parentId && cat.enabled);

    return roots
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((cat) => {
        const children = allCategories.filter((child) => child.parentId === cat.id && child.enabled);
        const count = countProductsForCategory(allProducts, cat.name) || 24;
        const subcategories = children.length
          ? mapChildCategories(cat, children, allProducts)
          : buildPresetSubcategories(cat.name, cat.icon, allProducts);

        return {
          id: cat.id,
          name: cat.name,
          icon: cat.icon || 'Package',
          count,
          image: getCategoryImage(cat.name),
          subcategories,
        };
      });
  }

  return CATEGORIES.map((cat, idx) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    count: countProductsForCategory(allProducts, cat.name) || 50 - idx * 5,
    image: getCategoryImage(cat.name),
    subcategories: buildPresetSubcategories(cat.name, cat.icon, allProducts),
  }));
}
