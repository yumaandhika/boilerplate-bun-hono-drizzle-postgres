import type { Context } from "hono";

export const successResponse = (c: Context, data: any = {}, meta: any = {}) => {
  const response = {
    status: true,
    data,
    ...(Object.keys(meta).length > 0 && { meta }),
  };
  return c.json(response);
};

export const successMessageResponse = (c: Context, message: string) => {
  return c.json({
    status: true,
    message,
  });
};

export const errorResponse = (c: Context, message: string) => {
  return c.json({
    status: false,
    message,
  });
};