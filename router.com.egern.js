export default async function (ctx) {
  const gateway = ctx.device?.ipv4?.gateway;
  const headers = { 'Cache-Control': 'no-store' };

  if (!gateway || !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(gateway)) {
    return ctx.respond({
      status: 503,
      headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
      body: '当前网络没有可用的 IPv4 默认网关。',
    });
  }

  return ctx.respond({
    status: 302,
    headers: { ...headers, Location: 'http://' + gateway },
  });
}
