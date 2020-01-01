const p = require('./package.js')
const settingList = require('./setting.js')
const event = require('./event.js')


const version = '1.0.0'

const getFd = path => {
    return new Promise((resolve, reject) => {
        p.fs.open(__dirname + path, 'a', (err, fd) => {
            if (err) return reject(err)
            return resolve(fd)
        })
    })
}

p.program
    .version(version, '-v, --version') // `-v` 显示版本号
    .command('init <name>') // `init <name>` 文件夹名称
    .action(name => {
        if (!p.fs.existsSync(name)) {
            p.inquirer
                .prompt([{
                    name: 'name',
                    message: '请输入拉取项目的名字'
                }])
                .then(answer => {
                    // 获取到对应的配置 `url` 列表
                    const list = settingList.settingList

                    // 判断用户是否输入**包的名字**
                    if (!answer.name) {
                        event.error(405, [
                            p.symbols.error,
                            p.chalk.red('请输入要拉取项目的名字')
                        ])
                    }
                    let url = null;
                    (async function () {
                        for (let i in list) {
                            let item = list[i]

                            if (answer.name.includes(item.name)) {
                                url = item.url
                                return // 找到了对应的url之后 立即退出循环
                            }
                        }
                        let errorText = `没有找到\`${answer.name}\`对应的url，请重新配置url\n`

                        let logFd = p.fs.openSync(__dirname + '/log.txt', 'a')

                        let format = event.fileFormat('err', errorText)

                        p.fs.writeSync(logFd, format)
                        if (!url)
                            event.error(404, [p.symbols.error, p.chalk.red(errorText)])
                    })()

                    const spinner = p.ora('\n正在下载内容...\n')

                    // 下载开始
                    spinner.start()

                    p.download(
                        // url 即为获取到对应的url
                        url,
                        name, {
                            clone: true
                        },
                        err => {
                            if (err) {
                                // 下载失败调用
                                spinner.fail()
                                event.error(405, [p.symbols.error, p.chalk.red(err)])
                            } else {
                                // 下载成功调用
                                spinner.succeed()

                                let successText = `\`${answer.name}\`拉取完成\n`

                                let format = event.fileFormat('success', successText)


                                p.fs.open(__dirname + '/log.txt', 'a', (err, fd) => {
                                    if (err) throw new Error(err)

                                    p.fs.write(fd, format, (err) => {
                                        if (err) throw new Error(err)

                                        console.log(p.symbols.success, p.chalk.green(successText))
                                    })
                                })
                            }
                        }
                    )
                })
                .catch(err => {
                    event.error(404, [
                        p.symbols.error,
                        p.chalk.red(err, '\n程序执行异常, 即将退出')
                    ])
                })
        } else {
            getFd('/log.txt').then(res => {

                    let errorText = `文件夹已存在，请重命名文件夹\n`
                    let format = event.fileFormat('err', errorText)

                    p.fs.write(res, format, (err, written, string) => {
                        if (err) throw err
                        event.error(405, [p.symbols.error, p.chalk.red(errorText)])
                    })
                })
                .catch(err => {
                    throw new Error(err)
                })
        }
    })

p.program.parse(process.argv)