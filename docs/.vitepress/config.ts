import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'en-US',
  title: '个人开发学习资料库',
  description: '基于VitePress开发',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],
  themeConfig: {
    logo: 'https://img.icons8.com/?size=500&id=46393&format=png&color=000000',
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lily0325/lily0325.github.io' }
    ],
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/introduction' },
      { text: '作品', link: '/work' },
      { text: '制作者', link: '/team' },
    ],

    sidebar: [
      {
        text: '简介',
        collapsed: false,
        link: '/introduction'
      },
      {
        text: '功能实现',
        collapsed: false,
        items: [
          { text: '静态资源请求处理器', link: '/function/ResourceHttpRequestHandler' },
          { text: '服务器部署前后端+SSL证书', link: '/function/deploy+ssl' },
          // { text: '功能使用', link: '/function' },
        ],
      },
      {
        text: '踩坑记录',
        collapsed: false,
        items: [
          { text: '2024踩坑日志', link: '/mistake/2024' },
        ],
      },
      {
        text: '知识',
        collapsed: false,
        items: [
          { text: 'WebSocket', link: '/knowledge/ws' },
          { text: 'SSE', link: '/knowledge/sse' },
        ],
      },
    ],
  },
});
