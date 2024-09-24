import{_ as a,c as n,a0 as e,o as t}from"./chunks/framework.CroFxgLA.js";const g=JSON.parse('{"title":"快速开始","description":"","frontmatter":{},"headers":[],"relativePath":"gettingStarted.md","filePath":"gettingStarted.md"}'),i={name:"gettingStarted.md"};function p(l,s,o,h,d,c){return t(),n("div",null,s[0]||(s[0]=[e(`<h1 id="快速开始" tabindex="-1">快速开始 <a class="header-anchor" href="#快速开始" aria-label="Permalink to &quot;快速开始  {#快速开始}&quot;">​</a></h1><h2 id="使用LLOneBot" tabindex="-1">使用LLOneBot <a class="header-anchor" href="#使用LLOneBot" aria-label="Permalink to &quot;使用LLOneBot {#使用LLOneBot}&quot;">​</a></h2><p>使用LLOneBot插件监听QQ的所有消息</p><p>启用HTTP服务</p><p>启用HTTP时间上报</p><p>添加HTTP事件上报地址 <code>http:127.0.0.1:8888/receive</code></p><h2 id="启动Leet-Robot" tabindex="-1">启动Leet-Robot <a class="header-anchor" href="#启动Leet-Robot" aria-label="Permalink to &quot;启动Leet-Robot {#启动Leet-Robot}&quot;">​</a></h2><p>获取<code>Leet-Robot</code>源码(联系Leet)</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// config.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> self_qq</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;robot qq号码&#39;</span></span></code></pre></div><p>安装依赖</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> i</span></span></code></pre></div><p>使用pkg打包出robot</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> package</span></span></code></pre></div><p>打包好的robot在根目录下的node-bot.exe</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.</span></span>
<span class="line"><span>├─ /api</span></span>
<span class="line"><span>├─ /handle</span></span>
<span class="line"><span>├─ /nodule_modules</span></span>
<span class="line"><span>├─ /search</span></span>
<span class="line"><span>├─ .gitignore</span></span>
<span class="line"><span>├─ config.js</span></span>
<span class="line"><span>├─ index.js</span></span>
<span class="line"><span>├─ node-bot.exe</span></span>
<span class="line"><span>├─ package-lock.json</span></span>
<span class="line"><span>├─ package.json</span></span>
<span class="line"><span>├─ utils.js</span></span>
<span class="line"><span>├─ README.md</span></span>
<span class="line"><span>└─ package.json</span></span></code></pre></div><p>window系统在命令行界面</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node-robot.exe</span></span></code></pre></div>`,17)]))}const k=a(i,[["render",p]]);export{g as __pageData,k as default};
