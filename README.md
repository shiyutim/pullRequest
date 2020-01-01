# pullRequest

## 功能

1. 拉取 github/coding 等 远程仓库代码
      <!-- 2. 提交远程仓库代码 -->
   <!-- 2. 提交服务器文件 -->

## 使用

拉取本项目：

```
- git clone https://github.com/shiyutim/pullRequest.git
- npm install
```

**拉取本项目后，首先需要在`setting.js`里面配置下载文件名字和 url**。（需要电脑安装`Node.js`，如果没有安装，请先安装`Node.js`）

Example :

```javascript
exports.settingList = [
  {
    name: 'lessMixin', // 这里的`name`就是输入命令时填入的name
    url: 'https://github.com:shiyutim/lessMixin'
  }
  // 这里为远程仓库的url
  // 这里需要注意 url格式为
  // `//github.com:` 这里`.com`之后是`:` 而不是`/`
  // 之后是姓名和文件夹名
]
```

配置好了之后，使用`node pullRequest init <name>` 拉取项目， 其中`name`为本地的文件夹名称，可以随意定义。确定后接着需要输入刚才配置的`name`，如`lessMixin`，这里可以下载对应的 url 项目。

## 命令

1. `-v/--version` 显示版本号。
2. `node pullRequest init <name>` **拉取远程仓库**文件并设置**文件夹名称**。

## 优势

1. 一次配置永久使用，不在需要繁琐的复制 url，然后`git clone`。
2. 错误信息生成*错误日志*，成功之后生成*成功日志*，日志在本项目的`log.txt`下。
