import { Hono } from 'hono';
import { createComponent, deleteComponent, getDetailComponent, getListComponents, updateComponent } from '../controllers/components';

export const ComponentsRoute = new Hono()
  .get('/', async (c) => {
    const result:any = await getListComponents(c.req);
    return c.json(result.body, result.status || 200);
  })
  .get('/:id', async (c) => {
    const result:any = await getDetailComponent(c.req);
    return c.json(result.body, result.status || 200);
  })
  .post('/', async (c) => {
    const result:any = await createComponent(c.req);
    return c.json(result.body, result.status || 200);
  })
  .put('/:id', async (c) => {
    const result:any = await updateComponent(c.req);
    return c.json(result.body, result.status || 200);
  })
  .delete('/:id', async (c) => {
    const result:any = await deleteComponent(c.req);
    return c.json(result.body, result.status || 200);
  });
