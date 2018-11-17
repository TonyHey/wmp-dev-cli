const actionTypes = {
  type: "list",
  name: "action",
  message: "choose operation type:",
  choices: [
    "1. open wechat developer tool",
    "2. push newest built code to qa/product enviroment",
    "3. login to wechat developer tool",
  ],
  default: "1. open wechat developer tool",
}

const uploadDesInput = {
  type: "input",
  name: "uploadDes",
  message: "input description fot this upload",
}

const envType = {
  type: "list",
  name: "env",
  message: "choose enviornment",
  choices: null,
  default: "development",
}
const wmpType = {
  type: "list",
  name: "wmpType",
  message: "choose wmp type",
  choices: null,
  default: "game",
}

module.exports = {
  actionTypes,
  uploadDesInput,
  envType,
  wmpType,
}
