import { cookies } from 'next/headers';

// USERTIERCONST
const tiers = [{"name":"Free","paid":false,"description":"Free tier","yearly_price":0,"monthly_price":0},{"name":"Basic","paid":true,"description":"Basic tier","yearly_price":100,"monthly_price":10},{"name":"Pro","paid":true,"description":"Pro tier","yearly_price":200,"monthly_price":20},{"name":"Enterprise","paid":true,"description":"Enterprise tier","yearly_price":300,"monthly_price":30}];
// ENDUSERTIERCONST

export async function check_auth(db:any, db_select:any): Promise<{UserID:string, UserLevel:number}> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  const sessionInfo = {
    UserID: '',
    UserLevel: 0
  }
  if (!sessionId) {
    return sessionInfo;
  }
  const session = await db_select(db, 'UserSession', ['UserID'], [], [{
    field: 'SessionToken',
    op: 'eq',
    value: sessionId
  }]);
  if (session.length > 0) {
    sessionInfo.UserID = session[0].UserID;
    
    // Get user level from User table
    const user = await db_select(db, 'User', ['UserLevel'], [session[0].UserID], undefined);
    if (user.length > 0) {
      sessionInfo.UserLevel = tiers.findIndex(tier => tier.name === user[0].UserLevel);
    }
  }
  return sessionInfo;
}   