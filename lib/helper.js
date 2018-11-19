const path = require("path")
const fs = require("fs")
const moment = require("moment")
const { spawn, spawnSync, execSync } = require("child_process")

// only for macbook right now
const wechatDevToolCli = "/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli"

const getDirDist = ({ wmpName = "", prefix = "", suffix = "" }) => {
  const cwd = process.cwd()
  return path.resolve(cwd, prefix, wmpName, suffix)
}
const openDevTool = (projectDir) => {
  const dir = projectDir || process.cwd()
  console.info("opening wmp devtool...")
  console.log(`project path: ${dir}`)
  spawn(wechatDevToolCli, ["-o", `${dir}`], {
    shell: true,
    stdio: "inherit",
  })
}
const loginWechatTool = () => {
  spawnSync(wechatDevToolCli, ["-l"], {
    shell: true,
    stdio: "inherit",
  })
}
const pushCode = ({ wmpName = "", wmpDescription, projectDir }) => {
  const dirDist = projectDir || process.cwd()
  const warningMsg = `build miniprogram ${wmpName} using non-dev mode first before upload`

  fs.readFile(`${dirDist}/project.config.json`, (err, configData) => {
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

    try {
      console.log("uploading project...")
      const cmd = `${wechatDevToolCli} -u ${versionAtDes} --upload-desc ${uploadDes}`

      execSync(cmd, {
        stdio: "inherit",
      })
    } catch (error) {
      console.log(`uploading err: ${error}`)
    }
  })
}

module.exports = {
  getDirDist,
  openDevTool,
  loginWechatTool,
  pushCode,
}
