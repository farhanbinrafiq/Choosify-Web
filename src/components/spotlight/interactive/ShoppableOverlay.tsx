import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitCompare, Heart, Share2, ShoppingBag } from 'lucide-react';
import { toast } from '../../../lib/notify';
import type { CatalogProduct } from '../../../types/catalog';
import type { SpotlightInteractiveCommerceEvent } from '../../../types/spotlight/interactive/event';
import type { SpotlightLiveTimelineChapter } from '../../../types/spotlight/interactive/timeline';
import { useDashboard } from '../../../context/DashboardContext';
import { trackInteractiveEvent } from '../../../hooks/useInteractiveCommerce';
import { cn } from '../../../lib/utils';
interface ShoppableOverlayProps {
  event: SpotlightInteractiveCommerceEvent;
  products: CatalogProduct[];
  activeChapter?: SpotlightLiveTimelineChapter;
  heroProductId?: string;
}

export function ShoppableOverlay({ event, products, activeChapter, heroProductId }: ShoppableOverlayProps) {
  const navigate = useNavigate();
  const { savedProducts, setSavedProducts, addToCompare } = useDashboard();

  const heroId = heroProductId ?? activeChapter?.links.find((l) => l.kind === 'product')?.entityId ?? products[0]?.id;
  const hero = products.find((p) => p.id === heroId);
  const pinned = products.filter((p) => p.id !== heroId).slice(0, 4);

  const toggleWishlist = (product: CatalogProduct) => {
    const isSaved = savedProducts.some((p) => p.id === product.id);
    if (isSaved) {
      setSavedProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success('Removed from vault');
    } else {
      setSavedProducts((prev) => [...prev, product]);
      toast.success('Saved to vault');
    }
    trackInteractiveEvent('buy_click', event.eventId, { productId: product.id, action: 'wishlist' });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/spotlight/${event.slug}`;
    if (navigator.share) {
      await navigator.share({ title: event.title, url }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    }
  };

  return (
    <aside className="space-y-4 text-left" aria-label="Shoppable products">
      {activeChapter && (
        <div className="p-3 rounded-[5px] bg-[#FFF8F4] border border-[#EB4501]/20">
          <p className="text-[10px] font-black uppercase text-[#EB4501]">{activeChapter.timestampLabel}</p>
          <p className="text-sm font-bold text-[#1a1a2e]">{activeChapter.title}</p>
        </div>
      )}

      {hero && (
        <div className="p-4 border border-[#EB4501]/30 rounded-[5px] bg-white shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#EB4501] mb-2">Hero Product</p>
          <img src={hero.image} alt="" className="w-full aspect-square object-cover rounded mb-3" />
          <p className="text-sm font-bold text-[#1a1a2e] line-clamp-2">{hero.title}</p>
          <p className="text-lg font-black text-[#EB4501] mt-1">৳{hero.price.toLocaleString()}</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                trackInteractiveEvent('buy_click', event.eventId, { productId: hero.id });
                navigate(`/products/${hero.slug || hero.id}#buy`);
              }}
              className="col-span-2 inline-flex items-center justify-center gap-1 py-2 bg-[#EB4501] text-white text-[10px] font-black uppercase rounded"
            >
              <ShoppingBag size={12} /> Buy
            </button>
            <button type="button" onClick={() => toggleWishlist(hero)} className="p-2 border rounded text-[#EB4501] hover:text-[#CF4400]" aria-label="Wishlist">
              <Heart
                size={14}
                strokeWidth={2}
                className={cn(
                  'text-[#EB4501]',
                  savedProducts.some((p) => p.id === hero.id) && 'fill-[#EB4501]',
                )}
              />
            </button>
            <button
              type="button"
              onClick={() => {
                addToCompare(hero);
                trackInteractiveEvent('compare_click', event.eventId, { productId: hero.id });
              }}
              className="p-2 rounded border-0 bg-transparent text-gray-500 hover:opacity-90 inline-flex items-center justify-center"
              aria-label="Compare"
            >
              <GitCompare size={14} stroke="url(#choosify-emi-icon-grad)" />
            </button>
          </div>
        </div>
      )}

      {pinned.length > 0 && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Pinned Products</p>
          <ul className="space-y-2">
            {pinned.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/products/${product.slug || product.id}`}
                  onClick={() => trackInteractiveEvent('pinned_product_click', event.eventId, { productId: product.id })}
                  className="flex gap-3 p-2 border border-[#e8edf2] rounded-[5px] hover:border-[#EB4501]/40"
                >
                  <img src={product.image} alt="" className="w-14 h-14 object-cover rounded shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold line-clamp-2">{product.title}</p>
                    <p className="text-sm font-black text-[#EB4501]">৳{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <Link
          to={`/publisher/${event.publisher.profileHref?.split('/').pop() ?? event.publisher.name}`}
          className="flex-1 text-center py-2 border border-[#e8edf2] text-[10px] font-bold uppercase rounded hover:border-[#EB4501]/40"
        >
          View Brand
        </Link>
        <button type="button" onClick={handleShare} className="p-2 border rounded text-gray-500" aria-label="Share">
          <Share2 size={14} />
        </button>
      </div>
    </aside>
  );
}
