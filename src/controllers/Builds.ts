import type { HonoRequest } from 'hono';
import { componentsTable } from '../db/schema/components';
import { db } from '../db';
import { eq } from 'drizzle-orm';

export const checkCompatibility = async (req: HonoRequest): Promise<{ body: any; status?: number }> => {
  const { processorId, motherboardId, ramId } = req.query();

  try {
    const processor :any = await db.select().from(componentsTable).where(eq(componentsTable.id, processorId)).execute();
    const motherboard :any = await db.select().from(componentsTable).where(eq(componentsTable.id, motherboardId )).execute();
    const ram :any = await db.select().from(componentsTable).where(eq(componentsTable.id, ramId )).execute();

    if (!processor.length || !motherboard.length || !ram.length) {
      return { status: 404, body: { message: 'One or more components not found' } };
    }

    if (processor[0].specifications.socketType !== motherboard[0].specifications.socketType) {
      return { body: { compatible: false, message: 'Processor socket type does not match motherboard' } };
    }

    if (motherboard[0].specifications.maxMemory < ram[0].specifications.capacity) {
      return { body: { compatible: false, message: 'Motherboard does not support the RAM capacity' } };
    }

    return { body: { compatible: true, message: 'Components are compatible' } };
  } catch (error) {
    console.error('Error checking compatibility:', error);
    return { status: 500, body: { message: 'Error checking compatibility' } };
  }
};

export const checkBottlenecks = async (req: HonoRequest): Promise<{ body: any; status?: number }> => {
  const { processorId, motherboardId, ramId } = req.query();

  try {
    const processor :any = await db.select().from(componentsTable).where(eq(componentsTable.id, processorId)).execute();
    const motherboard :any = await db.select().from(componentsTable).where(eq(componentsTable.id, motherboardId )).execute();
    const ram :any = await db.select().from(componentsTable).where(eq(componentsTable.id, ramId )).execute();

    if (!processor.length || !motherboard.length || !ram.length) {
      return { status: 404, body: { message: 'One or more components not found' } };
    }

    const isProcessorBottleneck = processor[0].specifications.baseClock < 3.0;
    const isRamBottleneck = ram[0].specifications.speed < 2400;

    return {
      body: {
        bottleneck: {
          processor: isProcessorBottleneck,
          ram: isRamBottleneck,
        },
        message: 'Bottleneck check completed',
      },
    };
  } catch (error) {
    console.error('Error checking bottlenecks:', error);
    return { status: 500, body: { message: 'Error checking bottlenecks' } };
  }
};

export const getUpgradeRecommendations = async (req: HonoRequest): Promise<{ body: any; status?: number }> => {
  const { componentId } = req.query();

  try {
    const component: any = await db.select().from(componentsTable).where(eq(componentsTable.id, componentId)).execute();

    if (!component.length) {
      return { status: 404, body: { message: 'Component not found' } };
    }

    const currentComponent = component[0];
    let recommendation: string | null = null;

    if (currentComponent.type === 'processor') {
      if (currentComponent.specifications.baseClock < 3.5) {
        recommendation = 'Consider upgrading to a faster processor';
      }
    } else if (currentComponent.type === 'ram') {
      if (currentComponent.specifications.speed < 3200) {
        recommendation = 'Consider upgrading to faster RAM';
      }
    }

    return {
      body: {
        recommendation: recommendation || 'No upgrade recommendations at this time',
      },
    };
  } catch (error) {
    console.error('Error getting upgrade recommendations:', error);
    return { status: 500, body: { message: 'Error getting upgrade recommendations' } };
  }
};