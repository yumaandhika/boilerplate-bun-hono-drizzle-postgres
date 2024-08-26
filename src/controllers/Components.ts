import type { HonoRequest } from 'hono'; // Type-only import
import { db } from '../db';
import { componentsTable } from '../db/schema/components';
import { and, count, eq } from 'drizzle-orm';

// Get List of Components
export const getListComponents = async (req: HonoRequest): Promise<{ body: any; status?: number }> => {
  // Extract pagination parameters from the query string
  const pageParam = req.query('page');
  const pageSizeParam = req.query('pageSize');
  const typeComponent = req.query('type');

  let conditions: any = [];
    
  if (typeComponent) {
    conditions.push(
      eq(componentsTable.type, typeComponent)
    );
  }

  // Parse pagination parameters with default values
  const page = pageParam ? parseInt(pageParam) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam) : 10;

  // Ensure page and pageSize are valid numbers
  if (isNaN(page) || page < 1) {
    return { status: 400, body: { message: 'Invalid page number' } };
  }
  if (isNaN(pageSize) || pageSize < 1) {
    return { status: 400, body: { message: 'Invalid page size' } };
  }
  // Calculate the offset
  const offset = (page - 1) * pageSize;

  try {
    const components = await db
      .select()
      .from(componentsTable)
      .where(and(...conditions))
      .limit(pageSize)
      .offset(offset)
      .execute();

    // Fetch total count for pagination metadata
    const totalComponents = await db
      .select({ count: count() })
      .from(componentsTable)
      .execute();
    const total = totalComponents[0].count;

    return { 
      body: {
        data: components,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };
  } catch (error) {
    console.error('Error fetching components:', error);
    return { status: 500, body: { message: 'Error fetching components' } };
  }
};

// Get Component by ID
export const getDetailComponent = async (req: HonoRequest): Promise<{ body: any; status?: number }> => {
  const id = req.param('id');
  if (!id) return { status: 404, body: { message: 'Component Not Found' } }
  try {
    const component = await db.select().from(componentsTable).where(eq(componentsTable.id, id)).execute();
    if (component.length === 0) {
      return { status: 404, body: { message: 'Component not found' } };
    }
    return { body: component[0] };
  } catch (error) {
    console.error('Error fetching component:', error);
    return { status: 500, body: { message: 'Error fetching component' } };
  }
};

// Create New Component
export const createComponent = async (req: HonoRequest): Promise<{ body: any; status?: number }> => {
  const newComponent: {
    name: string;
    type: string;
    brand: string;
    model: string;
    releaseDate: Date;
    specifications: any;
  } = await req.json();
  try {
    const result = await db.insert(componentsTable).values(newComponent).execute();
    return { status: 201, body: result };
  } catch (error) {
    console.error('Error creating component:', error);
    return { status: 500, body: { message: 'Error creating component' } };
  }
};

// Update Component
export const updateComponent = async (req: HonoRequest): Promise<{ body: any; status?: number }> => {
  const id = req.param('id');
  if (!id) return { status: 404, body: { message: 'Component Not Found' } }
  const updatedData: {
    name?: string;
    type?: string;
    brand?: string;
    model?: string;
    releaseDate?: Date;
    specifications?: any;
  } = await req.json();
  try {
    const result = await db.update(componentsTable).set(updatedData).where(eq(componentsTable.id, id)).execute();
    if (result.count === 0) {
      return { status: 404, body: { message: 'Component not found' } };
    }
    return { body: { message: 'Component updated successfully' } };
  } catch (error) {
    console.error('Error updating component:', error);
    return { status: 500, body: { message: 'Error updating component' } };
  }
};

// Delete Component
export const deleteComponent = async (req: HonoRequest): Promise<{ body: any; status?: number }> => {
  const id = req.param('id');
  if (!id) return { status: 404, body: { message: 'Component Not Found' } }
  try {
    const result = await db.delete(componentsTable).where(eq(componentsTable.id, id)).execute();
    if (result.count === 0) {
      return { status: 404, body: { message: 'Component not found' } };
    }
    return { body: { message: 'Component deleted successfully' } };
  } catch (error) {
    console.error('Error deleting component:', error);
    return { status: 500, body: { message: 'Error deleting component' } };
  }
};
