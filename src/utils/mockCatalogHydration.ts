import type { CommerceProduct } from '../types/schemas';
import type { Brand } from '../types/schemas';

type LegacyMockProduct = {
  id: number;
  title: string;
  brand: string;
  price: string;
  image: string;
  description?: string;
  category?: string;
};

type LegacyMockBrand = {
  id: number;
  name: string;
  logo: string;
  products: number;
  rating: number;
  category: string;
};

function getVariantsForProduct(productId: number, basePrice: number, baseImage: string): CommerceProduct['variants'] {
  if (productId === 1) {
    const colors = ['Titanium Gray', 'Titanium Yellow', 'Titanium Violet'];
    const storages = ['256GB', '512GB', '1TB'];
    const colorImages: Record<string, string> = {
      'Titanium Gray': baseImage,
      'Titanium Yellow': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
      'Titanium Violet': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    };
    const variants: NonNullable<CommerceProduct['variants']> = [];
    colors.forEach((color) => {
      storages.forEach((storage) => {
        let priceDiff = 0;
        if (storage === '512GB') priceDiff = 10000;
        if (storage === '1TB') priceDiff = 25000;
        let stock = 15;
        if (color === 'Titanium Yellow' && storage === '512GB') stock = 0;
        if (color === 'Titanium Violet' && storage === '256GB') stock = 0;
        variants.push({
          sku: `S24U-${color.split(' ')[1].toUpperCase()}-${storage}`,
          attributes: { color, storage },
          price: basePrice + priceDiff,
          stock,
          image: colorImages[color],
        });
      });
    });
    return variants;
  }

  if (productId === 2) {
    return [
      {
        sku: 'WH5-SILVER',
        attributes: { color: 'Platinum Silver' },
        price: basePrice,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
      },
      {
        sku: 'WH5-BLACK',
        attributes: { color: 'Midnight Black' },
        price: basePrice,
        stock: 18,
        image: baseImage,
      },
    ];
  }

  if (productId === 3) {
    const rams = ['8GB', '16GB', '24GB'];
    const storages = ['256GB', '512GB'];
    const variants: NonNullable<CommerceProduct['variants']> = [];
    rams.forEach((ram) => {
      storages.forEach((storage) => {
        let priceDiff = 0;
        if (ram === '16GB') priceDiff += 20000;
        if (ram === '24GB') priceDiff += 40000;
        if (storage === '512GB') priceDiff += 20000;
        variants.push({
          sku: `MBA3-${ram}-${storage}`,
          attributes: { ram, storage },
          price: basePrice + priceDiff,
          stock: 0,
          image: baseImage,
        });
      });
    });
    return variants;
  }

  if (productId === 4) {
    const colors = ['Obsidian Black', 'Hyper Crimson', 'Electric Blue'];
    const sizes = ['40', '41', '42', '43', '44'];
    const colorImages: Record<string, string> = {
      'Obsidian Black': baseImage,
      'Hyper Crimson': 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop',
      'Electric Blue': 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop',
    };
    const variants: NonNullable<CommerceProduct['variants']> = [];
    colors.forEach((color) => {
      sizes.forEach((size) => {
        let priceDiff = 0;
        if (color === 'Hyper Crimson') priceDiff = 400;
        if (color === 'Electric Blue') priceDiff = 600;
        let stock = 8;
        if (color === 'Obsidian Black' && size === '42') stock = 0;
        if (color === 'Hyper Crimson' && size === '40') stock = 0;
        if (color === 'Electric Blue' && size === '44') stock = 0;
        variants.push({
          sku: `NIKE-${color.split(' ')[1].toUpperCase()}-${size}`,
          attributes: { color, size },
          price: basePrice + priceDiff,
          stock,
          image: colorImages[color],
        });
      });
    });
    return variants;
  }

  if (productId === 6) {
    const colors = ['Stealth Black', 'Neon Lime', 'Carbon Grey'];
    const sizes = ['39', '40', '41', '42', '43'];
    const colorImages: Record<string, string> = {
      'Stealth Black': baseImage,
      'Neon Lime': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
      'Carbon Grey': 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop',
    };
    const variants: NonNullable<CommerceProduct['variants']> = [];
    colors.forEach((color) => {
      sizes.forEach((size) => {
        let priceDiff = 0;
        if (color === 'Neon Lime') priceDiff = 150;
        if (color === 'Carbon Grey') priceDiff = 250;
        let stock = 12;
        if (color === 'Stealth Black' && size === '41') stock = 0;
        if (color === 'Neon Lime' && size === '39') stock = 0;
        if (color === 'Carbon Grey' && size === '43') stock = 0;
        variants.push({
          sku: `APEX-${color.split(' ')[1].toUpperCase()}-${size}`,
          attributes: { color, size },
          price: basePrice + priceDiff,
          stock,
          image: colorImages[color],
        });
      });
    });
    return variants;
  }

  if (productId === 8) {
    const rams = ['8GB', '12GB'];
    const storages = ['256GB', '512GB'];
    const variants: NonNullable<CommerceProduct['variants']> = [];
    rams.forEach((ram) => {
      storages.forEach((storage) => {
        let priceDiff = 0;
        if (ram === '12GB') priceDiff += 4000;
        if (storage === '512GB') priceDiff += 4000;
        let stock = 16;
        if (ram === '12GB' && storage === '512GB') stock = 3;
        variants.push({
          sku: `XIAOMI-${ram}-${storage}`,
          attributes: { ram, storage },
          price: basePrice + priceDiff,
          stock,
          image: baseImage,
        });
      });
    });
    return variants;
  }

  return undefined;
}

export function buildMappedProductsFromMock(products: LegacyMockProduct[]): CommerceProduct[] {
  return products.map((p) => {
    const cleanPrice = parseFloat(p.price.replace(/,/g, '')) || 5000;
    return {
      id: p.id,
      title: p.title,
      image: p.image,
      brand: p.brand,
      codSupport: p.id !== 1,
      stock: p.id === 3 ? 0 : p.id === 5 ? 3 : 58,
      sellerId:
        p.brand === 'Samsung'
          ? 'seller-samsung'
          : p.brand === 'Apple'
            ? 'seller-apple'
            : p.brand === 'Apex'
              ? 'seller-apex'
              : 'seller-general',
      brandId: p.brand === 'Samsung' ? 1 : p.brand === 'Apple' ? 2 : p.brand === 'Apex' ? 3 : 4,
      price: cleanPrice,
      description:
        p.description ||
        `Full verified ${p.title} with complete manufacturer accessory bundle and native local warranty coverage.`,
      category: p.category,
      variants: getVariantsForProduct(p.id, cleanPrice, p.image),
    };
  });
}

export function buildFallbackBrandsFromMock(
  brands: LegacyMockBrand[],
  getBrandClaimStatus: (brandNameOrId: string | number) => 'verified' | 'pending' | 'community',
): Brand[] {
  return brands.map((b) => {
    const status = getBrandClaimStatus(b.id);
    return {
      id: b.id,
      name: b.name,
      logo: b.logo,
      verifiedStatus: status === 'verified',
      followers: Math.floor(b.products * 12.3),
      ratings: b.rating,
      sponsoredFlag: b.id === 1 || b.id === 2 || b.id === 10,
      featuredFlag: b.id === 3 || b.id === 11,
      category: b.category,
      claimStatus: status,
    };
  });
}
