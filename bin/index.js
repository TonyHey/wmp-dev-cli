const fs = require("fs")
const inquirer = require("inquirer")
const generateConfig = require("../utils/generateAppConfig")
const {
  actionTypes,
  uploadDesInput,
  wmpType,
  envType,
} = require("../inquirer-options")
const {
  openDevTool,
  loginWechatTool,
  pushCode,
  getDirDist,
} = require("../utils/helper")

const parseArgv = function() {
  const options = {}
  const argvArr = process.argv
  for (let i = 0; i < argvArr.length; i += 1) {
    const argv = argvArr[i]

    if (/^-[lh]{1}$/.test(argv)) {
      options[argv] = true
    } if (/^-(o|d|p|env|appid|prefix|suffix){1}$/.test(argv)) {
      const argValue = argvArr[i + 1]

      options[argv] = argValue
      if (/^-[o|p]{1}$/.test(argv) && (!argValue || /^-/.test(argValue))) {
        options[argv] = ""
      } else {
        i += 1
      }
    }
  }
  return options
}

const devTool = async () => {
  const options = parseArgv()
  let actionType = (typeof options["-o"] === "string" && 1)
    || (typeof options["-p"] === "string" && 2)
    || (options["-l"] && 3)
    || (options["-h"] && 4)
  let wmpName = options["-o"] || options["-p"]
  let wmpDescription = options["-d"]
  let env = options["-env"]
  let appid = options["-appid"]

  let configJson = {}
  try {
    const configJsonFile = fs.readFileSync(`${process.cwd()}/wmp.config.json`)
    configJson = JSON.parse(configJsonFile.toString())
  } catch (err) {
    console.error('Warning: No WMP configuration file named wmp.config.json.')
  }

  const {
    wmpTypes,
    envTypes,
    envAppIds,
    dirPrefix,
    dirSuffix,
  } = configJson
  const prefix = options["-prefix"] || dirPrefix
  const suffix = options["-suffix"] || dirSuffix
  let projectDir = process.cwd()

  if (!actionType) {
    actionType = await inquirer
      .prompt([actionTypes])
      .then(({ action }) => action.substr(0, 1))
  }
  if (actionType < 3) {
    if (!wmpName && wmpTypes) {
      wmpType.choices = wmpTypes
      wmpName = await inquirer
        .prompt([wmpType])
        .then(a => a.wmpType)
    }

    projectDir = getDirDist({ wmpName, prefix, suffix })
    await new Promise((resolve, reject) => {
      fs.readFile(`${projectDir}/project.config.json`, async (err) => {
        if (err) {
          if (!env && envTypes) {
            envType.choices = envTypes
            env = await inquirer
              .prompt([envType])
              .then(a => a.env)
          }
          if (!appid && envAppIds) {
            appid = envAppIds[wmpName] || envAppIds[env]
          }
          if (!wmpName) {
            const errMsg = 'Error: Please enter wmpName!!!'
            reject(errMsg)
          } else if (!appid) {
            const errMsg = 'Error: Please enter appid!!!'
            reject(errMsg)
          } else {
            generateConfig({
              wmpName,
              env,
              appid,
              projectDir,
              resolve,
              reject,
            })
          }
        } else {
          resolve()
        }
      })
    }).catch((err) => {
      console.log(err)
      actionType = 4
    })
  }

  switch (String(actionType)) {
  case "1":
    openDevTool(projectDir)
    break
  case "2":
    if (!wmpDescription) {
      wmpDescription = await inquirer
        .prompt([uploadDesInput])
        .then(({ uploadDes }) => uploadDes)
    }
    pushCode({ wmpName, wmpDescription, projectDir })
    break
  case "3":
    loginWechatTool()
    break
  default:
    console.log(`
-----------------------------------------------------------------------------
  [-h] 帮助信息
  [-l] 登录微信开发者工具
  [-o projectName]  打开项目 projectName
  [-p projectName]  上传代码到微信小程序平台或第三方平台
  [-env envName] 项目环境 development, production等
  [-appid appid] 小程序的appid
  [-prefix dirPath] 项目目录前缀
  [-suffix dirPath] 项目目录后缀

  推荐！创建如下的配置文件'wmp.config.json', 无参数run 'wmp' 'npx wmp-cli'
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
------------------------------------------------------------------------------
    `)
    break
  }
}

devTool()
