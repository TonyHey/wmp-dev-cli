# Wechat MiniProgram CLI
## quick start
### npx

```
npx wmp-cli [options]
```

[npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) 需npm 5.2+或更高版本

### npm

```
npm i wmp-cli --save-dev
wmp [options]
```


### Yarn

```
yarn add wmp-cli --dev
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

推荐！创建如下的配置文件`wmp.config.json`, 无参数run `wmp` `npx wmp-cli`
```
{
  "dirPrefix": "",
  "dirPrefix": "",
  "envAppIds": { //配置小程序appId， key可以是wmpType值或者envType值
    "production": "wxxxxxxxxxxxxxxxxx",
    "development": "wxxxxxxxxxxxxxxxxx"
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
