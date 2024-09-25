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
    avatar: 'https://avatars.githubusercontent.com/u/57285390?v=4',
    name: 'Leet',
    title: '制作者',
    links: [
      { icon: 'github', link: 'https://github.com/lily0325' },
    ]
  },
  
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      制作者
    </template>

  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>