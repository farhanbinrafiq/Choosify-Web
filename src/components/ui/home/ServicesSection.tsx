import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../badges/Badge';
import { POPULAR_SERVICE_TILES } from '../../../lib/home/popularServices';

interface ServicesSectionProps {
  onServiceClick?: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onServiceClick }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular Services</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Products &amp; services in one list</p>
        </div>
        <Link 
          to="/products" 
          className="text-xs font-bold text-[#EB4501] uppercase tracking-wider flex items-center gap-1 hover:text-[#CF4400]"
        >
          VIEW ALL <ChevronRight size={14} />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
        {POPULAR_SERVICE_TILES.map((srv) => (
          <Link
            key={srv.id}
            to={srv.href}
            onClick={() => onServiceClick?.(srv.id)}
            className="flex flex-col items-center justify-center gap-3 cursor-pointer group h-auto p-4 rounded-3xl bg-transparent border-transparent hover:bg-white hover:shadow-sm"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm border border-transparent"
              style={{ backgroundColor: srv.bg, color: srv.fg }}
            >
              <srv.icon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-xs font-bold text-slate-900">{srv.label}</h4>
              <Badge 
                variant="outline" 
                className="mt-1.5 text-[9px] font-semibold text-slate-400 bg-transparent py-0 px-1.5 normal-case border-slate-100"
              >
                Browse products
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
