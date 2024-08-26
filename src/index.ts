import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { CustomLoggers, CustomTimeoutException } from './utils/Loggers'
import { timeout } from 'hono/timeout'
import { Routes } from './routes'
import { Config } from './config/Config'
import figlet from 'figlet'

const app = new Hono()

app.use('*', logger(CustomLoggers)) // Logging All Request

app.use('/api', timeout(60000, CustomTimeoutException))
app.basePath('/api').route('/', Routes)

figlet("PCMate - API",
  {
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: false,
  },
  function (err: any, data: any) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data)
  console.log(`Server Running ${Config.app.host}:${Config.app.port}`);
  console.log(`Bun Version ${Bun.version}`);

  // Serve Bun
  Bun.serve({
    fetch: app.fetch,
    hostname: Config.app.host,
    port: Config.app.port,
  });
});

export default app
