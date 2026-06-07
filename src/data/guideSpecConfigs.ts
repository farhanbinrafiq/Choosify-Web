import { GuideSpecConfig } from '../types/guide';

export const CATEGORY_SPEC_CONFIGS: Record<string, GuideSpecConfig> = {
  mobile: {
    category: 'Mobile & Phones',
    criteriaList: [
      { iconName: 'Smartphone', label: 'Build Quality', pros: ['Durable frame', 'Premium finish'], cons: ['Heavy at 2.1 kg'], best: '#Professionals' },
      { iconName: 'Zap', label: 'Performance', pros: ['Fast processor', 'Excellent GPU'], cons: ['Runs a bit warm', 'No USB-A'], best: '#Power users' },
      { iconName: 'ShoppingBag', label: 'Value for Money', pros: ['Free shipping deals', 'Great warranty'], cons: ['High upfront cost'], best: '#SmartBuyers' },
      { iconName: 'Globe', label: 'Software & UI', pros: ['Very smooth UI', 'Multi-year updates'], cons: ['Slightly steep learning curve'], best: '#TechSavvy' },
      { iconName: 'MessageSquare', label: 'Customer Support', pros: ['2-yr brand warranty', 'Good local centers'], cons: ['Longer wait times'], best: '#Long-term' }
    ]
  },
  fashion: {
    category: 'Fashion & Lifestyle',
    criteriaList: [
      { iconName: 'ShoppingBag', label: 'Fabric Quality', pros: ['100% Breathable cotton', 'Anti-shrink weave'], cons: ['Special cold-wash needed'], best: '#ComfortSeekers' },
      { iconName: 'Zap', label: 'Fit & Comfort', pros: ['Ergonomic regular fit', 'Stretchable seams'], cons: ['Slightly tight waist'], best: '#DailyWearers' },
      { iconName: 'Smartphone', label: 'Color Durability', pros: ['Vibrant fast-colors', 'Resistant to sun fade'], cons: ['Delicate initial rinse'], best: '#Stylists' },
      { iconName: 'Globe', label: 'Design Versatility', pros: ['Modern fusion style', 'Perfect for Eid and casual'], cons: ['Fewer casual options'], best: '#TrendSetters' },
      { iconName: 'MessageSquare', label: 'Store Exchange', pros: ['Easy 7-day exchange', 'Store credits available'], cons: ['Original tag required'], best: '#SafeShoppers' }
    ]
  },
  beauty: {
    category: 'Beauty & Skincare',
    criteriaList: [
      { iconName: 'Zap', label: 'Ingredient Safety', pros: ['Paraben-free formula', 'Dermatologist tested'], cons: ['Mild scent might stay'], best: '#SensitiveSkin' },
      { iconName: 'Smartphone', label: 'Skin Absorption', pros: ['Ultra light texture', 'Non-greasy residue'], cons: ['Allow 1 min to set'], best: '#DrySkin' },
      { iconName: 'ShoppingBag', label: 'Long-term Efficacy', pros: ['Locks deep moisture', 'Brightens dark spots'], cons: ['Requires daily usage'], best: '#SkinEnthusiasts' },
      { iconName: 'Globe', label: 'Local Authenticity', pros: ['BSTI validated seal', 'Official importing agency'], cons: ['Counterfeits exist online'], best: '#PurityFirst' },
      { iconName: 'MessageSquare', label: 'Packaging Durability', pros: ['Leak-proof pump glass', 'Travel-friendly size'], cons: ['No refills sold'], best: '#FrequentTravelers' }
    ]
  },
  gaming: {
    category: 'Gaming & Entertainment',
    criteriaList: [
      { iconName: 'Zap', label: 'Graphics Processing', pros: ['True 4K at 60 FPS', 'Ray-tracing active'], cons: ['Hefty power draw'], best: '#HardcoreGamers' },
      { iconName: 'Laptop', label: 'Cooling Efficiency', pros: ['Liquid metal thermal', 'Whisper quiet fans'], cons: ['Bulky rear vent vents'], best: '#Streamers' },
      { iconName: 'ShoppingBag', label: 'Value & Bundles', pros: ['Includes 2 free games', '1 year warranty'], cons: ['Extra controllers costly'], best: '#ConsoleFans' },
      { iconName: 'Globe', label: 'Online Ecosystem', pros: ['Stable multiplayer ping', 'Easy digital store'], cons: ['Paid subscription needed'], best: '#Multiplayer' },
      { iconName: 'MessageSquare', label: 'Hardware Support', pros: ['Authorized parts care', 'Easy setup flow'], cons: ['Limited localized guides'], best: '#PremiumBuyers' }
    ]
  },
  home: {
    category: 'Home & Living',
    criteriaList: [
      { iconName: 'Laptop', label: 'Power Consumption', pros: ['5-star energy rating', 'Inverter technology'], cons: ['Higher base wattage'], best: '#EcoFriendly' },
      { iconName: 'Smartphone', label: 'Build Durability', pros: ['Stainless steel drum', 'Anti-rust exterior'], cons: ['Requires secure grounding'], best: '#Families' },
      { iconName: 'ShoppingBag', label: 'Ease of Cleaning', pros: ['Detachable filter meshes', 'Auto self-wash program'], cons: ['Manual descaling monthly'], best: '#BusyLifestyles' },
      { iconName: 'Globe', label: 'Design Aesthetics', pros: ['Sleek minimalist bezel', 'Space saving footprint'], cons: ['Only gray color sold'], best: '#DesignLovers' },
      { iconName: 'MessageSquare', label: 'After-sales Care', pros: ['10 year motor guarantee', 'Free home delivery & setup'], cons: ['Busy helpline hotlines'], best: '#PeaceOfMind' }
    ]
  }
};
