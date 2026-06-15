import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

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

  const [isFollowed, setIsFollowed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  });

  // Keep in sync with other instances of the same button on the page in real-time
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; isFollowed: boolean }>;
      if (customEvent.detail.id === id) {
        setIsFollowed(customEvent.detail.isFollowed);
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

    setIsFollowed(nextFollowed);

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
        "text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.03] active:scale-95 italic border cursor-pointer inline-flex items-center justify-center gap-1.5 select-none",
        isFollowed
          ? "bg-[#22C55E] text-white border-[#22C55E] shadow-md shadow-green-500/10" 
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
