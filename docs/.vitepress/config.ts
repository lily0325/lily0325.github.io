import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'en-US',
  title: '开发文档',
  description: '基于VitePress开发',
  base: '/',

  themeConfig: {
    logo: 'https://img.icons8.com/?size=500&id=46393&format=png&color=000000',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/docs' },
      { text: '作品', link: '/work' },
      { text: '制作者', link: '/team' },
    ],

    sidebar: [
      {
        // text: '基础配置',
        // collapsed: false,
        // items: [
        //   { text: '简介', link: '/introduction' },
        //   { text: '快速开始', link: '/gettingStarted' },
        //   { text: '功能使用', link: '/function' },
        // ],
      }
    ],
  },
});
