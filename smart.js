module.exports = {
  plugins: [
    {
      src: '@/plugins/redis',
      enable: false,
    },
    {
      src: '@/plugins/model',
      enable: false,
    },
  ],
  middlewares: [
    {
      src: '@/middlewares/cors',
    },
    {
      src: '@/middlewares/alive',
    },
    {
      src: '@/middlewares/bodyparser',
    },
    {
      src: 'koa-json',
    },
    {
      src: '@/middlewares/log4',
    },
    {
      src: '@/middlewares/URLPrefix',
      options: {
        prefix: '/api',
      },
    },
    {
      src: '@/middlewares/responseFormatter',
    },
    {
      src: '@/middlewares/jwt',
    },
  ],
}
