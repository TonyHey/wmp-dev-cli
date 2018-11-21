# Wechat MiniProgram CLI
## quick start
### npx

```
npx wmp-cli [options]
```

[npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f)

### npm

```
npm i -g wmp-cli
wmp [options]
```

### Yarn

```
yarn global add wmp-cli
wmp [options]
```

### options

```
[-h] 帮助信息
[-l] 登录微信开发者工具
[-o projectName]  打开项目 projectName
[-p projectName]  上传代码到微信小程序平台或第三方平台
[-env envName] 项目环境 development, production等
[-appid appid] 小程序的appid
[-prefix dirPath] 项目目录前缀
[-suffix dirPath] 项目目录后缀
```

添加配置文件～无参数run `wmp`👇👇👇

配置[project.config.json](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)

或者,创建如下文件`wmp.config.json`（多项目时比较方便)
```
{
  "dirPrefix": {
    "production": "",
    "development": ""
  },
  "dirPrefix": {
    "production": "",
    "development": ""
  },
  "envAppIds": { //配置小程序appId， key可以是wmpType值或者envType值
    "production": "wxxxxxxxxxxxxxxxxx",
    "development": "wxxxxxxxxxxxxxxxxx",
    "game": "wxxxxxxxxxxxxxxxxx",
    "news": "wxxxxxxxxxxxxxxxxx"
  },
  "envTypes": [ // 配置envType
    "development",
    "production"
  ],
  "wmpTypes": [ //配置小程序类类型（同项目根目录文件夹名称）
    "game",
    'news'
  ]
}
```

## issue
