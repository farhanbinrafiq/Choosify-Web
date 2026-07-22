import React, { useEffect } from "react";
import { Check } from "lucide-react";
import { toast } from '../lib/notify';
import { cn } from "../lib/utils";
import { useDashboard } from "../context/DashboardContext";
import { useGlobalState } from "../context/GlobalStateContext";

export interface FollowButtonProps {
  id: string; // Unique identifier for the brand or creator (e.g. brand ID or creator name)
  name: string; // Clean display name (e.g. "Apple" or "Farhan")
  type?: "brand" | "creator"; // Entity type to customize the toast message if needed
  className?: string; // Optional custom className overrides for dimensions/layout
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  id,
  name,
  type = "brand",
  className,
}) => {
  const storageKey = `choosify_followed_${id}`;
  const { followedBrands, setFollowedBrands } = useDashboard();
  const { allBrands, allCreators } = useGlobalState();

  const isFollowed = followedBrands.some((b: any) => 
    String(b.id) === String(id) || 
    (b.name && b.name.toLowerCase().trim() === String(id).toLowerCase().trim())
  );

  // Keep in sync with other instances of the same button on the page in real-time
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; isFollowed: boolean }>;
      if (customEvent.detail.id === id) {
        // Since state is now driven directly by Context, we don't need a local state setter,
        // but keeping this listener to respond to events if needed or keep compatibility.
      }
    };

    window.addEventListener("choosify-follow-toggle", handleToggle);
    return () => {
      window.removeEventListener("choosify-follow-toggle", handleToggle);
    };
  }, [id]);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextFollowed = !isFollowed;
    try {
      localStorage.setItem(storageKey, String(nextFollowed));
    } catch (err) {
      console.warn("localStorage write failed:", err);
    }

    if (!nextFollowed) {
      setFollowedBrands((prev: any[]) => prev.filter((b: any) => 
        String(b.id) !== String(id) && 
        (b.name ? b.name.toLowerCase().trim() !== String(id).toLowerCase().trim() : true)
      ));
    } else {
      const normId = String(id).toLowerCase().trim();
      let entityObj: Record<string, unknown>;

      if (type === 'creator') {
        const creator = allCreators.find(
          (c) =>
            String(c.id) === String(id) ||
            c.name?.toLowerCase().trim() === normId,
        );
        entityObj = creator
          ? { ...creator, _entityType: 'creator' as const }
          : { id, name: String(name || id), _entityType: 'creator' as const };
      } else {
        const brand = allBrands.find(
          (b) =>
            String(b.id) === String(id) ||
            b.name?.toLowerCase().trim() === normId,
        );
        entityObj = brand
          ? { ...brand, _entityType: 'brand' as const }
          : { id, name: String(name || id), _entityType: 'brand' as const };
      }

      setFollowedBrands((prev: any[]) => {
        const exists = prev.some((b: any) => String(b.id) === String(id));
        return exists ? prev : [entityObj, ...prev];
      });
    }

    // Toast notifications customized per requirements
    if (nextFollowed) {
      if (type === "brand") {
        toast.success(`Following ${name} for exclusive drops!`);
      } else {
        toast.success(`Following ${name} for ultimate guides!`);
      }
    } else {
      toast.success(`Unfollowed ${name}`);
    }

    // Emit event to update all other buttons instantly
    window.dispatchEvent(
      new CustomEvent("choosify-follow-toggle", {
        detail: { id, isFollowed: nextFollowed },
      })
    );
  };

  return (
    <button
      onClick={handleToggleClick}
      className={cn(
        // Base transitions, typography matches the standard "Follow the Brand" button on BrandDetailPage
        "text-[12px] md:text-[13px] font-bold tracking-tight transition-all duration-300 hover:brightness-110 active:scale-95 border cursor-pointer inline-flex items-center justify-center gap-1.5 select-none",
        isFollowed
          ? "bg-[#22C55E] !bg-[#22C55E] text-white !text-white border-[#22C55E] !border-[#22C55E] shadow-md shadow-green-500/10" 
          : "bg-white text-[#1A1D4E] border-[#e8edf2] hover:bg-gray-50 hover:border-gray-300 shadow-sm",
        className
      )}
    >
      {isFollowed && (
        <Check size={12} className="stroke-[3.5] animate-in fade-in zoom-in-75 duration-200" />
      )}
      <span>{isFollowed ? "Following" : "Follow"}</span>
    </button>
  );
};

export default FollowButton;
