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
      { text: '项目', link: '/project/project' },
      { text: '八股文', link: '/baguwen' },
      { text: '作品', link: '/work' },
      { text: '制作者', link: '/team' },
    ],

    sidebar: {
      '/': { base: '/', items: sidebarDocx() },
      '/project/': { base: '/project/', items: sidebarProject() }
    },
  },
});


function sidebarDocx(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      link: 'introduction'
    },
    {
      text: '功能实现',
      collapsed: false,
      items: [
        { text: '静态资源请求处理器', base: '/function/', link: 'ResourceHttpRequestHandler' },
        { text: '服务器部署前后端+SSL证书', base: '/function/', link: 'deploy+ssl' },
        { text: 'Actions工作流(自动部署)', base: '/function/', link: 'workflow' },
        { text: '跨域处理', base: '/function/', link: 'cors' },
        { text: 'github3D指标统计', base: '/function/', link: 'github3D' },
        { text: '前端录音', base: '/function/', link: 'recorder' },
        { text: '前端视频流播放实现', base: '/function/', link: 'video' },
      ],
    },
    {
      text: '踩坑记录',
      collapsed: false,
      items: [
        { text: '2024踩坑日志', base: '/mistake/', link: '2024' },
        { text: '2025踩坑日志', base: '/mistake/', link: '2025' },
      ],
    },
    {
      text: '知识',
      collapsed: false,
      items: [
        { text: '小知识点', base: '/knowledge/', link: 'smallpoint' },
        { text: 'WebSocket', base: '/knowledge/', link: 'ws' },
        { text: 'SSE', base: '/knowledge/', link: 'sse' },
        { text: '定时任务', base: '/knowledge/', link: 'cron' },
        { text: 'playwright简单使用', base: '/knowledge/', link: 'playwright' },
        { text: '前端视频流基础', base: '/knowledge/', link: 'video' },
      ],
    },
  ]
}

function sidebarProject(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      base: '/project/',
      link: 'project'
    },
    {
      text: '项目列表',
      collapsed: false,
      items: [
        { text: '内部人员管理系统', base: '/project/', link: 'personManagement' },
        { text: '视联网项目系统', base: '/project/', link: 'vnet' },
      ],
    },
  ]
}