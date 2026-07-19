import React from 'react';

export const Takeaways = ({ takeaways }: { takeaways: any[] }) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">KEY TAKEAWAYS</h2>
      <div className="flex flex-wrap gap-4">
        {takeaways.map((item, idx) => (
          <div key={idx} className="bg-white rounded-[20px] p-6 flex items-start gap-4 flex-1 min-w-[250px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] ">
            <div className="w-10 h-10 rounded-xl bg-body-bg flex items-center justify-center shrink-0 text-[#EB4501]">
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-[#050B2C] font-medium text-sm leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
