---
layout: page
sidebar: false
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://img.icons8.com/?size=500&id=59023&format=png&color=000000',
    name: 'leet-robot',
    title: '基于 NodeJs 实现的 QQ BOT',
    links: [
      { icon: 'github', link: 'https://git.leet-code.online/robot-vitepress/' },
    ]
  },
  
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      作品
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>