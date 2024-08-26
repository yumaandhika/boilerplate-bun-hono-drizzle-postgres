import { Hono } from 'hono';
import { getListComponents } from '../controllers/components';
import { checkBottlenecks, checkCompatibility, getUpgradeRecommendations } from '../controllers/Builds';

export const BuildsRoute = new Hono()
  .get('/', async (c) => {
    const result:any = await getListComponents(c.req);
    return c.json(result.body, result.status || 200);
  })
  .get('/check/compatibility', async (c) => {
    try {
      const result:any = await checkCompatibility(c.req);
      return result;
    } catch (error) {
      console.error('Error in GET /compatibility/check:', error);
      return c.json({ message: 'Error checking compatibility' }, 500);
    }
  })
  .get('/check/recommendations', async (c) => {
    try {
      const result:any = await getUpgradeRecommendations(c.req);
      return result;
    } catch (error) {
      console.error('Error in GET /recommendations:', error);
      return c.json({ message: 'Error getting upgrade recommendations' }, 500);
    }
  })
  .get('/check/bottleneck', async (c) => {
    try {
      const result : any = await checkBottlenecks(c.req);
      return result;
    } catch (error) {
      console.error('Error in GET /bottlenecks/check:', error);
      return c.json({ message: 'Error checking bottlenecks' }, 500);
    }
  });