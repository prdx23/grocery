
import { Component, createSignal, For } from 'solid-js';

import styles from './css/Popup.module.css';



const [ popups, setPopups ] = createSignal<string[]>([], {equals: false})

export function addPopup(msg: string) {
    setPopups(x => {
        x.push(msg)
        return x
    })
    setTimeout(() => {
        setPopups(x => {
            x.shift()
            return x
        })
    }, 3000)
}

export const Popup: Component = () => {
    return <section class={styles.popup_container}>
        <For each={popups()}>
            {(msg) => <span>{msg}</span>}
        </For>
    </section>
}
