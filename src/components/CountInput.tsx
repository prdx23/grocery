import { createSignal, Show, Switch, Match } from 'solid-js';

import styles from './CountInput.module.css';


type CountProps = {
    value: number,
    onchange: (value: number) => void,
    editonly?: boolean,
    class?: string,
}


export const CountInput = (props: CountProps) => {

    const [ edit, setEdit ] = createSignal(!!props.editonly);
    function toggle() { if( !props.editonly ) { setEdit((prev) => !prev); } }

    function incCount() {
        props.onchange(props.value < 99 ? props.value + 1 : 99);
    }

    function decCount() {
        props.onchange(props.value > 1 ? props.value - 1 : 1);
    }

    const minus = <button type='button' onclick={decCount} class='iconbtn'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.458 26.458">
            <path d="M9.922-26.458h6.614V0H9.922Z" transform="rotate(90)"/>
        </svg>
    </button>

    const plus = <button type='button' onclick={incCount} class='iconbtn'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.458 26.458">
            <path d="M9.922 0v9.922H0v6.614h9.922v9.922h6.614v-9.922h9.922V9.922h-9.922V0H9.922z"/>
        </svg>
    </button>

    return <div class={styles.count_container + ' ' + props.class}> <Switch>

        <Match when={props.editonly}>
            { minus }
            <div class={styles.editonly}>
                <p class={styles.number}>{ props.value }</p>
            </div>
            { plus }
        </Match>

        <Match when={!edit()}>
            <div style='display: flex;'>
                <Show when={ props.value < 10 }>&nbsp;</Show>
                <button type='button' class={styles.display} onclick={toggle}>
                    <p class={styles.number}>{ props.value }</p>
                </button>
            </div>
        </Match>

        <Match when={edit()}>
            { minus }
            <button type='button' class={styles.edit} onclick={toggle}>
                <p class={styles.number}>
                    { props.value.toString().padStart(2, '0') }
                </p>
            </button>
            { plus }
        </Match>

    </Switch> </div>

}
