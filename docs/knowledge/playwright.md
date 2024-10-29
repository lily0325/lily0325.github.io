# PlayWright简单使用

## 简单介绍

[官方文档](https://playwright.nodejs.cn/docs/intro)

Playwright 是微软制作的一个` Node.js `库，用于自动化浏览器操作，支持多种浏览器，如` Chrome、Firefox 和 WebKit`。它提供了一个简单的 API，使得编写测试脚本变得容易。

而且它还提供了一些有用的功能，如`录制和回放浏览器操作`，以及在不同浏览器之间共享会话。

对于不会写测试脚本的兄弟来说，**`Playwright`** 是一个非常好的选择，它可以帮助你自动化浏览器操作，提高测试效率，减少测试成本。

## 安装

```bash
npm init playwright@latest
```

创建一个playwright项目

运行安装命令并选择以下内容以开始：

1. 在 TypeScript 或 JavaScript 之间进行选择（默认为 TypeScript）

2. 你的测试文件夹的名称（如果你的项目中已有测试文件夹，则默认为测试或 e2e）

3. 添加 GitHub Actions 工作流程以轻松在 CI 上运行测试

4. 安装 Playwright 浏览器（默认为 true）

项目中就会出现以下结构：

```
playwright.config.ts
package.json
package-lock.json
tests/
  example.spec.ts
tests-examples/
  demo-todo-app.spec.ts
```

一般执行测试的脚本是在`tests`文件夹下的`example.spec.ts`中。

## 录制测试脚本

录制脚本使用命令

```bash
npx playwright codegen [URL_ADDRESS]
```
URL_ADDRESS是你要测试的网页地址，如果没有地址则会自动打开浏览器。

然后就会自动打开浏览器，你可以在浏览器中操作，然后会自动生成对应的脚本代码。

![image.png](https://s2.loli.net/2024/10/25/2dMlYgIAhmHv5KO.png)

右侧就是生成的脚本代码，会根据你在浏览器中操作的内容不断自动生成。

录制好脚本之后将脚本代码复制到`example.spec.ts`中。

## 执行测试脚本

想要运行测试脚本，只需要执行以下命令即可：

```bash
npx playwright test
```

会自动运行`/tests/`文件夹下的中的所有测试脚本。

运行测试脚本之后，默认会使用三个浏览器进行测试，分别是`Chrome、Firefox 和 WebKit`，并输出测试结果，并生成测试报告，测试报告会保存在`/tests/`文件夹下的`playwright-report`文件夹中，同时也会有本地的浏览器预览，你可以在浏览器中查看测试结果。


注意：

1. 测试脚本的识别默认是对文件名以`.spec.ts`结尾的

2. 测试脚本默认是无头（headless）模式下运行，这意味着它在没有图形界面的情况下运行浏览器，如果想要在图形界面下运行浏览器，则需要在执行测试脚本的命令后面添加`--headed`。

3. 测试脚本默认是并行运行的，这意味着它会同时使用多个浏览器实例来运行测试脚本，如果你想要在单个浏览器实例下运行测试脚本，则需要在执行测试脚本的命令后面添加`--project=chromium`。

4. 如果测试的网页需要登录，则需要在测试脚本中添加登录的代码。

## playwright 配置文件

`playwright.config.js`是Playwright测试框架中的一个配置文件，它允许你自定义测试运行的多个方面，包括测试环境、全局设置、测试筛选条件等。

下面是对`playwright.config.js`中一些常见配置项的分析：

1. **`testDir`**: 指定测试文件所在的目录。例如：
   ```javascript
   testDir: './tests',
   ```
   这意味着测试将从`./tests`目录下开始查找。

2. **`testMatch`**: 定义哪些文件应该被视为测试文件。例如：
   ```javascript
   testMatch: ['**/*.spec.ts', '**/*.test.ts'],
   ```
   这将匹配所有扩展名为`.spec.ts`和`.test.ts`的文件。

3. **`use`**: 提供一组全局的测试选项，这些选项将应用于所有的测试。例如：
   ```javascript
   use: {
     baseURL: 'https://example.com',
     viewport: { width: 1280, height: 720 },
   },
   ```
   这里设置了所有测试的基URL以及浏览器窗口的大小。

4. **`projects`**: 允许你定义多个测试项目，每个项目可以有不同的配置。这对于多环境测试非常有用。例如：
   ```javascript
   projects: [
     {
       name: 'chromium',
       use: { browserName: 'chromium' },
     },
     {
       name: 'firefox',
       use: { browserName: 'firefox' },
     },
   ],
   ```
   这将分别在Chromium和Firefox浏览器中运行测试。

5. **`reporter`**: 设置测试报告的格式和输出位置。例如：
   ```javascript
   reporter: 'html',
   ```
   或者更复杂的配置：
   ```javascript
   reporter: [['list'], ['html', { open: 'never' }]],
   ```

6. **`timeout`**: 设置测试的超时时间。例如：
   ```javascript
   timeout: 30 * 1000,
   ```
   这将设置测试的超时时间为30秒。

7. **`retryOnFailure`**: 控制测试失败后的重试次数。例如：
   ```javascript
   retryOnFailure: 2,
   ```
   这将允许每个失败的测试重试两次。

8. **`forbidOnly`**: 禁止使用`it.only()`和`describe.only()`，以防止意外地跳过其他测试。例如：
   ```javascript
   forbidOnly: !!process.env.CI,
   ```
   这将在CI环境中禁止使用`only`。

9. **`globalSetup`** 和 **`globalTeardown`**: 指定在所有测试之前和之后运行的脚本。例如：
   ```javascript
   globalSetup: './setup.js',
   globalTeardown: './teardown.js',
   ```

通过这些配置项，你可以高度定制Playwright的测试运行流程，以适应不同的测试需求和环境。

## 其他功能

1. 屏幕截图

   ```javascript
   await page.screenshot({ path:'screenshot.png', fullPage:true });
   ```
   在测试脚本中添加以上代码即可。path是截图的保存路径，fullPage是是否全屏截图。

   ```javascript
   await page.screenshot({ path:'screenshot.png', clip:{ x:0, y:0, width:100, height:100 } });
   ```
   clip是截取元素的位置和大小。

   ```javascript
   await page.locator('.header').screenshot({ path: 'screenshot.png' });
   ```
   截取单个元素的截图

2. 录制视频

   ```javascript
   await page.video().saveAs('video.mp4');
   ```
   在测试脚本中添加以上代码即可。path是视频的保存路径。

3. 状态管理

   ```javascript
   const storageState = await page.context().storageState();
   await page.context().addCookies(storageState.cookies);
   ```
   在测试脚本中添加以上代码即可。storageState是状态管理的对象，cookies是状态管理的cookie。

   如果想要保持登陆状态，比如在localStorage中保存登陆信息，则可以使用以下代码：

   ```javascript
    // 在页面加载前，设置localStorage中的token
    await page.evaluateOnNewDocument(() => {
        // 设置localStorage中的token
        localStorage.setItem('token', 'your_token_here');
    });


    // 在页面加载后，更新localStorage中的token
    await page.context().addInitScript(() => {
        localStorage.setItem('token', 'your_token_here');
    });
   ```


