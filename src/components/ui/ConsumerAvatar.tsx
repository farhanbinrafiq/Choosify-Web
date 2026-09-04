import React, { useEffect, useState } from 'react';

/**
 * The one place the authenticated Consumer's avatar is rendered.
 *
 * Single canonical source: `currentUser.avatar` from GlobalStateContext (kept in
 * sync by Profile Settings via setCurrentUser after a successful upload/remove).
 * When that is empty — or the image fails to load — it falls back to the name
 * initial on the existing brand gradient. No second avatar source, no
 * localStorage, no cache-busting needed (each upload gets a fresh media URL).
 */
export default function ConsumerAvatar({
  src,
  name,
  size = 28,
  className = '',
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  // A new URL (e.g. Photo A -> Photo B) must clear a prior load error.
  useEffect(() => {
    setBroken(false);
  }, [src]);

  const initial = (name || 'C').trim().charAt(0).toUpperCase() || 'C';
  const showImage = Boolean(src) && !broken;

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-[#FF5B00] to-[#2323FF] flex items-center justify-center text-white font-bold shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(9, Math.round(size * 0.4)) }}
    >
      {showImage ? (
        <img
          src={src as string}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        initial
      )}
    </div>
  );
}
