const path = require("path")
const fs = require("fs")
const moment = require("moment")
const { spawn, spawnSync } = require("child_process")
const inquirer = require("inquirer")
const { resetExtAppid } = require('./inquirer-options')

// only for macbook right now
const wechatDevToolCli = "/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli"

const getDirDist = ({ wmpName = "", prefix = "", suffix = "" }) => {
  const cwd = process.cwd()
  return path.resolve(cwd, prefix, wmpName, suffix)
}

const tryCommand = async (cmd, args) => {
  let hasError = false // 解决 微信小程序开发者工具 莫名奇妙报一些undefined的错,然后原地run一次命令就ok的坑
  await new Promise((resolve) => {
    const runCommand = spawn(cmd, args || [])

    runCommand.stdout.on('data', (data) => {
      console.log(`${data}`)
    })
    runCommand.stderr.on('data', (err) => {
      const stderr = `${err}`
      if (/of\sundefined/.test(stderr)) {
        hasError = true
      } else {
        const errorQuering = /Error:\s([A-z]|\s)+/.exec(stderr)
        const errorInfo = errorQuering ? errorQuering[0].replace(/\\/, '') : stderr
        console.log(errorInfo)
      }
      runCommand.kill()
    })
    runCommand.on('close', () => {
      resolve()
    })
  })
  if (hasError) {
    console.log(`
  something wrong and don't know how it occurred.
  try again ok ok...
    `)

    const tryCommandAgain = spawn(cmd, args || [])

    tryCommandAgain.stdout.on('data', (data) => {
      const stdoutData = `${data}`
      if (/uploading|success/.test(stdoutData)) {
        console.log(`${stdoutData}`)
      }
    })
    tryCommandAgain.stderr.on('data', (err) => {
      console.log(/Error:\s([A-z]|\s)+/.exec(`${err}`)[0].replace(/\\/, ''))
      tryCommandAgain.kill()
    })
  }
}

const openDevTool = (projectDir) => {
  const dir = projectDir || process.cwd()
  console.log(`project path: ${dir}`)
  const args = ["-o", dir]
  tryCommand(wechatDevToolCli, args)
}
const loginWechatTool = () => {
  spawnSync(wechatDevToolCli, ["-l"], {
    stdio: "inherit",
  })
}
const pushCode = ({ wmpName = "", wmpDescription, projectDir }) => {
  const dirDist = projectDir || process.cwd()
  const warningMsg = `build miniprogram ${wmpName} using non-dev mode first before upload`

  fs.readFile(`${dirDist}/project.config.json`, async (err, configData) => {
    if (err) {
      console.error(`read project.config.json failed: ${err}`)
      return
    }

    const dataString = configData.toString()
    const projectConfig = JSON.parse(dataString)
    if (projectConfig.devMode) {
      console.error(warningMsg)
      return
    }

    await new Promise((resolve, reject) => {
      // const readStream = fs.createReadStream(`${dirDist}/ext.json`, { encoding: "utf8" })
      // const writeStream = fs.createWriteStream(`${dirDist}/ext.json`, { encoding: "utf8" })
      // readStream.on('error', readStreamErr => reject(readStreamErr))
      // readStream.on('data', async(chunk) => {
      //   const newChunk = chunk.replace(/"extAppid":\s?"\w+"/, '"extAppId": ""')
      //   console.log('文件内容:', newChunk)
      //   writeStream.write(newChunk)
      // })
      // readStream.on('end', () => resolve())
      fs.readFile(`${dirDist}/ext.json`, { encoding: "utf8" }, (extErr, extData) => {
        if (extErr) {
          reject(extErr)
        } else {
          inquirer
            .prompt([resetExtAppid])
            .then(({ isResetExtAppid }) => {
              if (isResetExtAppid) {
                const newExt = extData.replace(/"extAppid":\s?"\w+"/, '"extAppid": ""')
                fs.writeFile(`${dirDist}/ext.json`, newExt, () => resolve())
              } else {
                resolve()
              }
            })
        }
      })
    }).catch(extErr => extErr)

    const version = `v${moment().format("YYYYMMDDHHmm")}`

    const getGitUserName = spawnSync("git", ["config", "--get", "user.name"])
    const gitUserName = getGitUserName.stdout
      .toString()
      .replace(/\n/g, "")
      .replace(/\s/g, "-")

    const versionAtDes = `${version}@${dirDist}`
    const description = wmpDescription
      ? wmpDescription.replace(/\s/g, "-")
      : "这个人很懒，什么也没留下"
    const uploadDes = `[${gitUserName}][${wmpName}]${description}`
    const args = ["-u", versionAtDes, "--upload-desc", uploadDes]

    tryCommand(wechatDevToolCli, args)
  })
}

module.exports = {
  getDirDist,
  openDevTool,
  loginWechatTool,
  pushCode,
}
