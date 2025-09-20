// USERTIERCONST
const tiers = [{"name":"Free","paid":false,"description":"Free tier","yearly_price":0,"monthly_price":0},{"name":"Basic","paid":true,"description":"Basic tier","yearly_price":100,"monthly_price":10},{"name":"Pro","paid":true,"description":"Pro tier","yearly_price":200,"monthly_price":20},{"name":"Enterprise","paid":true,"description":"Enterprise tier","yearly_price":300,"monthly_price":30}];
// ENDUSERTIERCONST

import { useUserStore } from '@/store/user';

export function checkLevelVisibility(requiredTier: string): boolean {
  const userLevel = useUserStore.getState().userLevel;
  const userTierIndex = tiers.findIndex(tier => tier.name === userLevel);
  return userTierIndex >= tiers.findIndex(tier => tier.name === requiredTier);
}