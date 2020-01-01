const error = (code, log) => {
    if (!code) {
        throw new Error('code is not defined')
    }
    if (typeof code !== 'number') {
        throw new Error('code is must be number')
    }
    if (log) {
        if (log instanceof Array) {
            log.length > 1 ? console.log(log[0], log[1]) : console.log(log[0])
        } else {
            console.log('error: ', log)
        }
    }


    process.on('exit', code => {
        console.log(`退出码: ${code}`)
    })
    process.exit(code);

}

const prompt = (name, message) => {

    let result = {
        name: null,
        message: null
    }
    let proxy = new Proxy(result, {
        get(target, key) {
            return (key in target) ? target[key] : `value not defined`
        },

        set(target, key, value) {
            console.log(value, 'value')
            if (!value) {
                error(404, 'value not defined')
            }
            return target[key] = value
        }
    })
    proxy.name = name
    proxy.message = message
    return proxy
}


const fileFormat = (type, msg) => {
    let typeList = ['err', 'success', 'warning']
    let result = {
        name: null,
        message: null
    }

    let proxy = new Proxy(result, {
        get(target, key) {
            return target[key]
        },

        set(target, key, value) {

            // type 拦截
            if (key === 'name') {

                let val = typeList.some((item) => {
                    return item === value
                })

                if (!val) {

                    throw new Error(`first argument is must be '${typeList}'`)
                }

                target[key] = value
            }

            // message 拦截
            if (key === 'message') {

                if (!value)
                    throw new Error('message is not defined')

                target[key] = value
            }
        }
    })

    proxy.name = type
    proxy.message = msg

    return `\n${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}——[${proxy.name}]: ${proxy.message}`
}

module.exports = {
    error,
    prompt,
    fileFormat
}