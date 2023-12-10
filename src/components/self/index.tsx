import {Command, useCommandState} from 'launcher-api'
import React, {useState} from 'react'
import {useApplications} from './applicationItem'
import {useLocalExtensions} from "@/components/self/localExtension";
import {SubCommand} from "@/components/subCommand";
import {useBuiltin} from "@/components/self/builtin";
import {SearchItem, SearchResp} from "@/native/types";
import {Application, LocalExtension} from "@/native";
import RenderItem from "@/components/self/renderItem";
import {useInterval} from "ahooks";
import {doingSearch} from "@/components/self/helper";
import {sleep} from "ahooks/es/utils/testingHelpers";

const sort = (extensions: SearchResp<LocalExtension>[], apps: SearchResp<Application>[], builtins: SearchResp<string>[]) => {
    const arr = [...extensions, ...apps, ...builtins]
    arr.sort((a, b) => {
        return b.score - a.score
    })

    return arr
}

function getHeader(value: string) {
    if (value.length == 0) {
        return 'Recommend'
    }
    return 'Results';
}

function selectFirstItem(value: string) {
    if (value.length == 0) {
        sleep(50).then(() => {
            const event = new KeyboardEvent('keydown', {code: 'Home'})
            window.dispatchEvent(event)
        })
    }
}

export default function Self() {
    const commandRef = React.useRef<HTMLInputElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    const [value, setValue] = React.useState('')
    const [items, setItems] = useState<SearchResp<SearchItem>[]>([])

    const {extensions, refreshExt,} = useLocalExtensions(value)
    const {apps, refreshApp} = useApplications(value)
    const {builtins} = useBuiltin(value)

    React.useEffect(() => {
        inputRef.current?.focus()
    })

    React.useEffect(() => {
        const arr = sort(extensions, apps, builtins)
        setItems(arr)
    }, [extensions, apps, builtins])

    useInterval(() => {
        if (doingSearch({searchText: value})) return
        refreshExt(value)
        refreshApp(value)
    }, 1000)

    const onValueChange = (v: string) => {
        setValue(v)
        selectFirstItem(v);
    }

    return (
        <Command ref={commandRef} shouldFilter={false} className='raycast' label="Global Command Menu">
            <div cmdk-raycast-top-shine=""/>
            <Command.Input value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
            <Command.List ref={listRef}>
                <Command.Empty>No results found.</Command.Empty>

                <Command.Group heading={getHeader(value)}>
                    {
                        items.map((item) => {
                            return (<RenderItem item={item}/>)
                        })
                    }
                </Command.Group>
            </Command.List>

            <div cmdk-raycast-footer="">
                <div className='icon'>🖖</div>

                <button cmdk-raycast-open-trigger="">
                    Open Application
                    <kbd>↵</kbd>
                </button>

                <hr/>

                <SubCommand listRef={listRef} selectedValue={value} inputRef={inputRef}/>
            </div>
        </Command>
    )
}
