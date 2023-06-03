import { onCleanup, onMount } from "solid-js"


export function onLoseFocus(node: HTMLElement, func: () => void) {
    function handleClick(event: Event) {
        if( event.target != node ) { func() }
    }
    onMount(() => document.addEventListener('click', handleClick, true))
    onCleanup(() => document.removeEventListener('click', handleClick, true))
}

