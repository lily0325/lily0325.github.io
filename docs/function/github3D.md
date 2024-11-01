# GitHub 个人资料 3D Contrib

![](https://raw.githubusercontent.com/yoshi389111/github-profile-3d-contrib/main/docs/demo/profile-gitblock.svg)

此 GitHub Action 在 3D 个人资料图像上创建 GitHub 贡献日历。

此操作将生成您的 github 个人资料 3d 贡献日历并提交到您的 repo。添加此操作后，您也可以自行触发操作。

## 部署使用步骤

1. 在 GitHub 上创建一个与你的用户名同名的仓库。

2. 创建一个如下所示的工作流文件。`.github/workflows/profile.yml`

    ```yaml

    name: GitHub-Profile-3D-Contrib

    on:
      schedule: # 03:00 JST == 18:00 UTC
        - cron: "0 18 * * *"
      workflow_dispatch:

    jobs:
      build:
        runs-on: ubuntu-latest
        name: generate-github-profile-3d-contrib
        steps:
          - uses: actions/checkout@v3
          - uses: yoshi389111/github-profile-3d-contrib@0.7.1
            env:
              GITHUB_TOKEN: ${{ secrets.TOKEN }}
              USERNAME: ${{ github.repository_owner }}
          - name: Commit & Push
            run: |
              git config user.name github-actions
              git config user.email github-actions@github.com
              git add -A .
              git commit -m "generated"
              git push
    ```

    TOKEN 是您的 GitHub 访问令牌。

    需要去个人设置页面创建一个访问令牌。

    `settings->Developer Settings->Personal access tokens->Tokens (classic)`

    生成的token放到仓库的`secrets`中。

3. 触发工作流。

    通过以上步骤，您可以成功部署并使用 GitHub 个人资料 3D Contrib。