
import { createSignal, Show, Switch, Match } from 'solid-js';
import { Portal } from "solid-js/web";
import { add, parse, differenceInCalendarDays } from 'date-fns'

import { CountInput } from './CountInput';
import type { ExpiryDate } from './Item';
import icons from '../icons';
import styles from './css/ExpiryInput.module.css';


type ExpiryInputProps = {
    value: ExpiryDate,
    onchange: (value: ExpiryDate) => void,
    editonly?: boolean,
    class?: string,
}


export const ExpiryInput = (props: ExpiryInputProps) => {

    const [ show, setShow ] = createSignal(false);
    function toggle() { setShow((prev) => !prev) }

    const today = new Date()

    function updateDays(days: number) {
        props.onchange(add(today, { days: days }))
    }

    function updateDate(date: string) {
        props.onchange(parse(date, 'yyyy-MM-dd', today))
    }

    function resetExpiry() {
        props.onchange('none')
    }


    function displayDays() {
        let days = 1
        if( props.value != 'none' ) {
            days = differenceInCalendarDays(new Date(props.value), today)
        }
        return days
    }

    function displayDate() {
        let date = add(today, { days: 1 })
        if( props.value != 'none' ) { date = new Date(props.value) }
        return toISOStringWithTimezone(date).slice(0, 10)
    }

    return <div class={styles.expiry_container + ' ' + props.class}>

        <Show when={!!props.editonly}>
            <button type='button' class={styles.mainbtn} onclick={toggle}>
                <Show when={props.value == 'none'}>
                    Set Expiry
                </Show>
                <Show when={props.value != 'none'}>
                    Expires in {displayDays()} days
                </Show>
            </button>
        </Show>

        <Show when={!!!props.editonly}>
            <Show when={props.value == 'none'}>
                {/* <button */}
                {/*     type='button' */}
                {/*     class={styles.action + ' iconbtn ' + styles.clockbtn} */}
                {/*     onclick={toggle} */}
                {/*     title={'Set Expiry'} */}
                {/* > */}
                {/*     { icons.clock() } */}
                {/* </button> */}

                <button type='button' class={styles.display} onclick={toggle}>
                    {/* Set Expiry */}
                    <div class={styles.clockbtn}>{ icons.clock() }</div>
                </button>
            </Show>
            <Show when={props.value != 'none'}>
                <button type='button' class={styles.display} onclick={toggle}>
                    Expires in {displayDays()} days
                </button>
            </Show>
        </Show>

        <Show when={show()}>
            <section>
                <div class={styles.days}>
                    {/* <input type='number' min='1'/> <p> Days </p> */}
                    <p> Days: </p>
                    <CountInput
                        value={displayDays()}
                        onchange={updateDays}
                        editonly={true}
                    />
                </div>
                <div class={styles.or}>
                    <hr/>
                    <p> or </p>
                    <hr/>
                </div>
                <div class={styles.date}>
                    <p> Date: </p>
                    <input
                        type='date'
                        min={toISOStringWithTimezone(today).slice(0, 10)}
                        value={displayDate()}
                        onchange={(e) => updateDate(e.target.value)}
                    />
                </div>
                <div class={styles.or}>
                    <hr/>
                    <p> or </p>
                    <hr/>
                </div>
                <button type='button' onclick={resetExpiry}>
                    No Expiry
                </button>
            </section>
        </Show>

        {/* <Portal mount={document.getElementById('modal')!}> */}
        {/*     <div>My Content</div> */}
        {/* </Portal> */}

    </div>

}

const toISOStringWithTimezone = (date: Date) => {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        diff + pad(tzOffset / 60) +
        ':' + pad(tzOffset % 60);
};
