const isDev = process.env.NODE_ENV !== 'production';

const fmt = (level, msg, meta) => {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level}] ${msg}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
};

export const logger = {
  info: (msg, meta) => console.log(fmt('INFO ', msg, meta)),
  warn: (msg, meta) => console.warn(fmt('WARN ', msg, meta)),
  error: (msg, meta) => console.error(fmt('ERROR', msg, meta)),
  debug: (msg, meta) => isDev && console.debug(fmt('DEBUG', msg, meta)),
};
