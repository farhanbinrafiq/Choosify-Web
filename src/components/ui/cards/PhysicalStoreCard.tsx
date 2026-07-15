import React from 'react';
import { cn } from '../../../lib/utils';
import { MapPin, Clock } from 'lucide-react';
import { Button } from '../buttons/Button';
import { Badge } from '../badges/Badge';

export interface PhysicalStoreCardProps {
  image: string;
  storeName: string;
  address: string;
  isOpen?: boolean;
  hours?: string;
  onViewMap?: () => void;
  className?: string;
}

export const PhysicalStoreCard: React.FC<PhysicalStoreCardProps> = ({
  image,
  storeName,
  address,
  isOpen = false,
  hours,
  onViewMap,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col group", className)}>
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={storeName} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h4 className="text-sm font-extrabold text-[#000435] mb-2">{storeName}</h4>
        
        <div className="flex flex-col gap-2 mb-5 flex-1">
          <div className="flex items-start gap-2 text-xs font-medium text-slate-500">
            <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
            <span className="leading-relaxed">{address}</span>
          </div>
          {(isOpen || hours) && (
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 shrink-0 text-slate-400" />
              {isOpen && <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-green-200 text-green-600 bg-green-50">Open</Badge>}
              {hours && <span className="text-xs font-bold text-slate-600">{hours}</span>}
            </div>
          )}
        </div>
        
        {onViewMap && (
          <Button variant="outline" size="sm" onClick={onViewMap} leftIcon={<MapPin className="w-3.5 h-3.5" />} className="w-full text-xs">
            View on Map
          </Button>
        )}
      </div>
    </div>
  );
};
