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
        text: '前端',
        collapsed: false,
        items: [
          { text: '快速开始', link: '/gettingStarted' },
          { text: '功能使用', link: '/function' },
        ],
      },
      {
        text: '后端',
        collapsed: false,
        items: [
          { text: '快速开始', link: '/gettingStarted' },
          { text: '功能使用', link: '/function' },
        ],
      },
      {
        text: '知识',
        collapsed: false,
        items: [
          { text: 'WebSocket', link: '/doc/ws' },
          { text: 'SSE', link: '/doc/sse' },
        ],
      },
      {
        text: '功能',
        collapsed: false,
        items: [
          { text: '快速开始', link: '/gettingStarted' },
          { text: '功能使用', link: '/function' },
        ],
      }
    ],
  },
});
