# 静态资源请求处理器ResourceHttpRequestHandler

## 1.传统采用IO方式传输文件
用文件流方式，在springboot读取整个视频文件的文件流，写入HttpServletResponse的OutputStream。
```java
private void preview(String filename, String path, HttpServletResponse response) {
        OutputStream os;
        try {
            response.addHeader("Content-disposition", "attachment;filename=" +
                    URLEncoder.encode(filename, "UTF-8"));
            response.setCharacterEncoding("UTF-8");
            byte[] bytes = FileUtil.readBytes(path + filename);
            os = response.getOutputStream();
            os.write(bytes);
            os.flush();
            os.close();
        } catch (Exception e) {
            // System.out.println(e);
    }
}

```
但是这种方式很`消耗服务器内存`，而且前端那边得把整个视频下载好才能播放，而且如果视频很大那就会有很大的卡顿时间，对于用户体验是极差的。

虽然这种方法不适合传输视频等静态文件，但是如果是传输`动态生成`的文件，比如html和json文件，那就适合用这种方式。


## 2.采用静态资源请求处理器
使用http的rang来实现分片加载，也就是视频会有缓存，不会下载整个视频文件，而是下载视频的一部分进行播放，可以拖动进度条，快进等。

普遍的方法是根据前端要的文件片段，springboot加载本地文件，切分出具体那段文件，返回给前端去播放，但是实际上没必要那么麻烦。

因为`springboot自带`这方面的能力！

ResourceHttpRequestHandler是springboot加载静态资源的一个类，平时是用来从resources/statics等目录加载文件的。所以，这个类本身就是支持range请求数据的。
主要用于`处理静态资源请求`，其内部实现可能会根据需要进行优化以提高性能。

### 实现代码

首先、创建一个bean NonStaticResourceHttpRequestHandler
```java
@Component
public class NonStaticResourceHttpRequestHandler extends ResourceHttpRequestHandler {
    public final static String ATTR_FILE = "NON-STATIC-FILE";
    @Override
    protected Resource getResource(HttpServletRequest request) {
        String filePath =  (String) request.getAttribute(ATTR_FILE);
        return new FileSystemResource(filePath);
    }
}
```
其次、在控制层或者业务层使用这个bean
```java
@Autowired
private NonStaticResourceHttpRequestHandler nonStaticResourceHttpRequestHandler;
    
private void previewVideo(String filename, String path, HttpServletRequest request, HttpServletResponse response) {
        try {
            String filepath = path + filename;
            File file = new File(filepath);
            if (file.exists()) {
                request.setAttribute(NonStaticResourceHttpRequestHandler.ATTR_FILE, filepath);
                nonStaticResourceHttpRequestHandler.handleRequest(request, response);
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.setCharacterEncoding("UTF-8");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_GATEWAY);
            System.out.println("播放视频错误!");
        }
    }
```
前端调用接口传入对应的视频文件名播放就可以了



## 思考

那么相比于传统的写入HttpServletResponse的OutputStream，ResourceHttpRequestHandler的区别在哪里？

__首先，ResourceHttpRequestHandler通常用于处理像图片、CSS、JavaScript等`静态资源`的请求，这些资源通常会被缓存，并且请求处理逻辑相对简单。__

__相比之下，使用OutputStream直接写入HttpServletResponse通常用于`动态生成`内容，例如根据用户请求或数据库内容动态生成HTML页面或JSON数据。__

在静态资源处理方面，ResourceHttpRequestHandler可能具有优势，因为它可以针对静态资源的特性进行优化，例如使用高效的缓存机制、减少磁盘I/O等。然而，在处理动态内容生成时，使用OutputStream可能更加灵活和直接。

综上所述，ResourceHttpRequestHandler和OutputStream在处理不同类型请求时`各有优势`，其性能差异取决于具体的使用场景和配置。在实际应用中，应根据需求选择合适的处理方式。