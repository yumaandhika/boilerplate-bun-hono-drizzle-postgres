import { HTTPException } from "hono/http-exception"

export const CustomLoggers = (message: string, ...rest: string[]) => {
  console.log(message, ...rest)
}

export const CustomTimeoutException = (context: any) =>
  new HTTPException(408, {
    message: `Request timeout after waiting ${context.req.headers.get(
      'Duration'
    )} seconds. Please try again later.`,
  })