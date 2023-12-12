import {addAppRunCount, getApplications, getIcon} from "./application";
import {getBuiltin} from "./builtin";
import {getLocalExtensions, getRemoteExtensions, installExtension} from "./extension";

export {
    getApplications, addAppRunCount, getIcon
}

export {
    getRemoteExtensions,
    getLocalExtensions,
    installExtension
}

const execCommand = async (command: string, args: string[], terminal?: boolean) => {
    return (await fetch("http://localhost:35677/api/exec/command", {
        method: "POST",
        body: JSON.stringify({command, args, terminal})
    })).text()
}

const setConfig = async (key: string, value: any) => {
    return (await fetch("http://localhost:35677/api/config/set", {
        method: "POST",
        body: JSON.stringify({key, value: JSON.stringify(value)})
    })).text()
}

const getConfig = async (key: string) => {
    return (await fetch("http://localhost:35677/api/config/get", {
        method: "POST",
        body: JSON.stringify({key})
    })).text()
}

export {
    getBuiltin,
    setConfig, getConfig,
    execCommand
}


export type {Application, SearchItem, SearchResp, RemoteExtensionResp, RemoteExtension, LocalExtension} from './types'
export * from './types'
