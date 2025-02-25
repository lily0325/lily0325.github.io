# Github Actions workflow--工作流 (自动部署)

[官方文档](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)

[GitHub Actions 入门教程(阮一峰)](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

`持续集成`由很多操作组成，比如抓取代码、运行测试、登录远程服务器，发布到第三方服务等等。

`Actions` 是 `GitHub` 上的一个功能，它允许开发者自动化软件开发和部署的过程。通过 Actions，你可以创建自定义的工作流程，这些工作流程可以在代码推送到仓库时`自动触发`，执行一系列的任务，如测试、构建、部署等。

## 工作流文件

工作流是通过一个名为 `workflow` 的 YAML 文件来定义的。这个文件通常存放在仓库<u>.github/workflows</u> 目录下。

## 基本概念

GitHub Actions 有一些自己的术语。

1. workflow （工作流程）：持续集成一次运行的过程，就是一个 workflow。

2. job （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。

3. step（步骤）：每个 job 由多个 step 构成，一步步完成。

4. action （动作）：每个 step 可以依次执行一个或多个命令（action）。

## 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
```yaml
name: Deploy VitePress site to Pages
# VitePress部署到github pages

on:
  #事件触发机制
  #你可以设定以下事件之一或多个事件触发工作流程：

  # push: 当有提交被推送到仓库时。
  # pull_request: 当有 Pull Request 被创建或更新时。
  # schedule: 根据定时计划执行。
  # release: 当创建了一个新的 Release 时。
  # workflow_dispatch: 允许手动触发工作流程。

  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      # name相当于起了一个名字，这个名字可以在部署的时候看的到；只要能看出部署到了哪一步就可以。
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      #安装项目依赖
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      #打包项目
      - name: Build with VitePress
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      #上传工件
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist #打包后的文件位置

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
    # 使用了deploy-pages动作的第4版本，这是专门用于将工件部署到GitHub Pages。
```
每次更新上传代码到github的时候，都会自动重新将项目进行部署到github pages里。


## 部署到个人服务器

如果想要将项目自动部署到自己的服务器，那关键点就在最后一个action，也就是Upload artifact，前面基本上可以不需要变动。（后面的#部署工作删除）

```yaml
name: Deploy VitePress site to Pages
# VitePress部署到github pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      # name相当于起了一个名字，这个名字可以在部署的时候看的到；只要能看出部署到了哪一步就可以。
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      #安装项目依赖
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      #打包项目
      - name: Build with VitePress
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      # 更换成以下配置
      # Deploy
      - name: Deploy
        uses: easingthemes/ssh-deploy@v2.0.7
        env:
          SSH_PRIVATE_KEY: ${{ secrets.ACCESS_TOKEN }}
          ARGS: "-avz --delete"
          SOURCE: "docs/.vitepress/dist/" # 打包好的文件位置
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.TARGET }}
```

这里的值有些是字符串，有些值是`${ { secrets.XXX } }`这种格式，表示使用变量，使用的目的当然是为了安全，比如我们这里的`secrets.ACCESS_TOKEN`就是一个服务器的私钥，这种东西当然不能公开。

去github对应项目仓库的Settings里的Secrets下设置需要保密的值。(以下步骤复杂，需认真查看)

![Settings](https://s2.loli.net/2024/09/30/rub5RsiSUY4wTkQ.png)


首先添加的是`ACCESS_TOKEN`，但是这个值并不是你服务器的密码。

首先去你服务器的`~/.ssh`目录，此时目录下应该有4个文件，分别是`authorized_keys`、`id_rsa`、`id_rsa.pub`、`known_hosts`。

如果没有`id_rsa`和`id_rsa.pub`的，可以使用`ssh-keygen`来生成，这两个文件就是安装Git时需要生成的私钥和公钥。

这个时候你看看`authorized_keys`里面有没有内容，如果有内容说明你之前设置过，`ACCESS_TOKEN`的值就是`authorized_keys`所对应的私钥。

如果没有内容的话，你可以直接设置为公钥`id_rsa.pub`的内容，如执行命令`cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys`，此时就会把`id_rsa.pub`的内容写入`authorized_keys`中.

然后把`ACCESS_TOKEN`的值设置为私钥`id_rsa`中的内容，你可以运行命令`cat ~/.ssh/id_rsa` 然后把内容复制一份到`ACCESS_TOKEN`中

设置`ACCESS_TOKEN`值的目的是为了远程不使用密码来连接服务器，当`ACCESS_TOKEN`的值设置好了，接下来就容易了。依次设置`REMOTE_HOST`、`REMOTE_USER`、`TARGET`的值，比如`XXX.XXX.XXX.XXX`、`root`、`/nginx/html`等，具体的根据自己的ECS来设置。

设置好之后就可以更新上传`deploy.yml`文件让它自动进行部署。

Github Actions 就会自动将项目打包并上传到对应服务器上面。


## 简单的使用方法

上述内容可能麻烦了些，如果你是使用ssh账号与密码的话，那也可以使用`actions/ssh-deploy`来进行部署，具体的配置方式可以参考下面的配置。

以下配置是将打包好的文件上传到云服务器对应的文件夹内。

```yaml
      # Deploy
      - name: 删除云服务器对应文件夹内的文件
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          port: ${{ secrets.SERVER_PORT }}
          username: ${{ secrets.SERVER_USERNAME }}
          password: ${{ secrets.SERVER_PASSWORD }}
          script: rm -rf /home/frontEnd/test/*

      - name: 将构建输出上传到云服务器对应文件夹内
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          port: ${{ secrets.SERVER_PORT }}
          username: ${{ secrets.SERVER_USERNAME }}
          password: ${{ secrets.SERVER_PASSWORD }}
          source: "dist/*" # 假设你的构建输出在dist目录下
          target: "/home/frontEnd/test"
```

也是要在github仓库的Settings里的Secrets下设置需要保密的值。




### 掘金类似文章

[【前端工程化】自动化篇-Github Action基本使用、自动部署组件库文档、github3D指标统计](https://juejin.cn/post/7356815857078157331?searchId=20240930161155DD73504AC8BB882C0C76)


## 在github上部署nodejs爬虫

首先得在仓库里放好nodejs爬虫的代码，然后在github上创建一个`.github/workflows` 目录并在其中添加一个 YAML 文件来配置 GitHub Actions。

```yaml
name: Fetch Web Data and Save to Repository

on:
  schedule:
    - cron: '0 0 * * *' # 每天凌晨执行一次
  workflow_dispatch:

jobs:
  fetch-data:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          ref: main
          # 自定义的个人推送TOKEN
          token: ${{ secrets.PUSH_TOKEN }}  

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      # 安装依赖项
      - name: Install dependencies
        run: npm ci
      # 运行爬虫脚本
      - name: Fetch Web data
        run: |
          node your-script.js
      # 将生成的 JSON 文件上传为动作的工件
      - name: Commit and push changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@users.noreply.github.com"
          git add .
          git commit -m "Update data.json"  || echo "No changes to commit"
          git push origin main
```

使用 `npm ci` 和 `npm run your-script.js` 来安装依赖并运行你的爬虫脚本。最后，使用 `actions/upload-artifact` 将生成的 JSON 文件上传为动作的工件。

