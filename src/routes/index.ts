import { Hono } from 'hono'
import { ComponentsRoute } from './Components'

export const Routes = new Hono()
  .route('components', ComponentsRoute)
