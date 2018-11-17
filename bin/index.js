const fs = require("fs")
const inquirer = require("inquirer")
const generateConfig = require("../utils/generateAppConfig")
const {
  actionTypes,
  uploadDesInput,
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
    if (/^-[l,h]{1}$/.test(argv)) {
      options[argv] = true
    } else if (/^-[o,d,p,env,appid,prefix,suffix]{1}$/.test(argv)) {
      i += 1
      options[argv] = argvArr[i]
    }
  }
  return options
}

const devTool = async () => {
  const options = parseArgv()
  let actionType = (options["-o"] && 1) || (options["-p"] && 2) || (options["-l"] && 3)
  let wmpName = options["-o"] || options["-p"]
  let wmpDescription = options["-d"]
  let env = options["-env"]
  let appid = options["-appid"]

  let configJson = {}
  try {
    const configJsonFile = fs.readFileSync(`${process.cwd()}/wmp.config.json`)
    configJson = JSON.parse(configJsonFile.toString())
  } catch (err) {
    console.error(err)
  }

  const {
    wmpType,
    envType,
    envAppId,
    dirPrefix,
    dirSuffix,
  } = configJson
  const prefix = options["-prefix"] || dirPrefix
  const suffix = options["-suffix"] || dirSuffix

  if (!actionType) {
    actionType = await inquirer
      .prompt([actionTypes])
      .then(({ action }) => action.substr(0, 1))
  }
  if (!wmpName && wmpType) {
    wmpName = await inquirer
      .prompt([wmpType])
      .then(a => a.wmpType)
  }

  const projectDir = getDirDist({ wmpName, prefix, suffix })
  await new Promise((resolve, reject) => {
    fs.readFile(`${projectDir}/project.config.json`, async (err) => {
      if (err) {
        if (!env && envType) {
          env = await inquirer
            .prompt([envType])
            .then(a => a.env)
        }
        if (!appid && envAppId) {
          appid = envAppId[wmpName] || envAppId[env]
        }
        if (!wmpName) {
          console.error('please enter WMP name')
          reject()
        } else if (!appid) {
          console.error('please enter appid')
          reject()
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
  })

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
    break
  }
}

devTool()
