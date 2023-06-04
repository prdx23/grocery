import { onCleanup, onMount } from "solid-js"


declare module "solid-js" {
    namespace JSX {
        interface Directives {
            onLoseFocus: () => void
        }
    }
}


export function onLoseFocusDirective(node: Element, func: () => () => void) {
    function handleClick(event: Event) {
        if( !node.contains(event.target as Node) ) { func()() }
    }
    onMount(() => document.addEventListener('click', handleClick, true))
    onCleanup(() => document.removeEventListener('click', handleClick, true))
}
