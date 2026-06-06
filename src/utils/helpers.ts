export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const getDayOfWeek = (date: Date): string => {
  const days = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];
  return days[date.getDay()];
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pl-PL');
};

export const calculatePromoDiscount = (items: number[]) => {
  const sorted = [...items].sort((a, b) => a - b);
  const freeCount = Math.floor(sorted.length / 3);
  const discountAmount = sorted
    .slice(0, freeCount)
    .reduce((sum, item) => sum + item, 0);
  return {
    freeCount,
    discountAmount,
    finalTotal: items.reduce((sum, item) => sum + item, 0) - discountAmount,
  };
};