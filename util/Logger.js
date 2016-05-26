"use strict";

class Logger {
    log(str) {
        this._log(str, process.stdout, 'log', 92);
    }
    error(str) {
        this._log(str, process.stderr, 'err', 91);
    }
    err(str) {
        this.error(str);
    }
    _log(str, stream, type, fcolor) {
        if (!Logger.initialized)
            Logger.init();
        if (typeof str != 'string')
            if (typeof str == 'object')
                str = JSON.stringify(str);
            else
                str = str.toString();
        const time = Logger.fixLength((new Date()).toLocaleTimeString(), 11, true);
        const pre = `${Logger.format(1)}${time}: ${Logger.format(fcolor)+Logger.format(1)}[${this.provider}]${Logger.format(0)}> `;
        if (Logger.lastProvider == this.provider && Logger.lastText == str && Logger.lastType == type) {
            Logger.clearLine(stream);
            Logger.repeatCount++;
        }
        else {
            stream.write('\n');
            Logger.repeatCount = 0;
        }
        const post = Logger.repeatCount > 0 ? 'x' + (Logger.repeatCount + 1) : '';
        let fstr = Logger.fixLength(str, Logger.width - (pre.replace(/\x1B\[[1-9]+m/g, '').length + post.replace(/\x1B\[[1-9]+m/g, '').length), false);
        stream.write(`${pre}${Logger.format(1)}${fstr}${Logger.format(240)}${post}${Logger.format(0)}`);
        Logger.lastProvider = this.provider;
        Logger.lastText = str;
        Logger.lastType = type;
        Logger.receivers.forEach(receiver => {
            receiver.log(time, this.provider, str);
        });
    }
    constructor(provider) {
        if (!Logger.initialized)
            Logger.init();
        if (!provider)
            provider = 'LOGGER';
        provider = provider.toUpperCase();
        if (provider.length != Logger.loggerLen)
            provider = Logger.fixLength(provider, Logger.loggerLen);
        this.provider = provider;
    }
    static clear(stream) {
        if (!stream)
            stream = process.stdout;
        for (let i = 0; i < Logger.heigth; i++)
            stream.write('\n');
    }
    static clearLine(stream) {
        if (!stream)
            stream = process.stdout;
        stream.write('\r');
        for (let i = 0; i < Logger.width; i++)
            stream.write(' ');
        stream.write('\r');
    }
    static init(loggerLen) {
        if (Logger.initialized)
            throw 'Already initialized!';
        if (!loggerLen)
            loggerLen = 9;
        Logger.heigth = process.stdout.rows;
        Logger.width = process.stdout.columns;
        process.stdout.on('resize', function () {
            let prevWidth = Logger.width;
            Logger.width = process.stdout.columns;
            let prevHeigth = Logger.heigth;
            Logger.heigth = process.stdout.rows;
            Logger.clear();
            if (prevWidth != Logger.width)
                Logger.log('Console width was changed from ' + prevWidth + ' to ' + Logger.width);
            if (prevHeigth != Logger.heigth)
                Logger.log('Console heigth was changed from ' + prevHeigth + ' to ' + Logger.heigth);
        });
        Logger.loggerLen = loggerLen;
        Logger.receivers = [];
        Logger.lastProvider = '';
        Logger.lastText = '';
        Logger.lastType = '';
        Logger.repeatCount = 0;
        Logger.initialized = true;
        Logger.clear();
        Logger.log('Init finished');
    }
    static fixLength(s, l, d, c) {
        d = !!d;
        if (!c)
            c = ' ';
        if (s.length < l) {
            while (s.length < l)
                s = d ? c + s : s + c;
        }
        else if (s.length > l) {
            s = s.match(d ? new RegExp(`.*(.{${l}})`) : new RegExp(`(.{${l}})`))[0];
        }
        return s;
    }
    static log(str) {
        if (!Logger.initialized)
            Logger.init();
        if (!this.instance)
            this.instance = new Logger();
        this.instance.log(str);
    }
    static attachLogReceiver(receiver, ...params) {
        if (!Logger.initialized)
            Logger.init();
        Logger.receivers.push(new receiver(Logger, ...params));
    }

    static format(code) {
        return "\x1B[" + code + "m";
    }
}

module.exports = Logger;