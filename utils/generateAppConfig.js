const fs = require("fs")
const path = require("path")

const generateConfig = ({
  wmpName,
  env,
  appid,
  projectDir,
  resolve,
  reject,
}) => {
  const baseConfigDir = path.resolve(__dirname, "../config/base.project.config.json")

  console.info("generate project.config.json...")
  fs.readFile(baseConfigDir, async (readFileErr, data) => {
    if (readFileErr) {
      reject(readFileErr)
    } else {
      const targetEnv = env || ""
      const dataString = data.toString()
      const configJson = JSON.parse(dataString)
      const devMode = process.env.DEV_MODE === "true"
      // const devModeDescription = devMode ? "develop" : "release"
      const projectConfig = {
        appid,
        projectname: `${wmpName}${targetEnv ? `-${targetEnv}` : ""}`,
        devMode,
      }
      Object.assign(configJson, projectConfig)
      const configJsonStr = JSON.stringify(configJson)

      const configDist = `${projectDir}/project.config.json`
      fs.writeFile(
        configDist,
        configJsonStr,
        (writeFileErr) => {
          if (writeFileErr) {
            reject(writeFileErr)
          } else {
            console.info(`generate ${configDist} Success`)
            resolve()
          }
        },
      )
    }
  })
}

module.exports = generateConfig
