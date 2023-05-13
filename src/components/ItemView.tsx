
import { createSignal, Show } from 'solid-js';
import { add, differenceInCalendarDays } from 'date-fns'

import { Items } from './Item';
import type { Item, ExpiryDate } from './Item';
import { CountInput } from './CountInput';
import { TextInput } from './TextInput';
import { ExpiryInput } from './ExpiryInput';
import icons from '../icons';
import styles from './css/ItemView.module.css';



export const ItemView = (props: { item: Item }) => {

    function updateCount(x: number) { Items.updateCount(props.item.id, x) }
    function updateName(x: string) { Items.updateName(props.item.id, x) }
    function updateExpiry(x: ExpiryDate) { Items.updateExpiry(props.item.id, x) }
    function deleteItem() { Items.delete(props.item.id) }

    function moveToInventory() {
        Items.changeLocation(props.item.id, 'inventory')
    }

    function addToShoppingList() {
        Items.add(props.item.name, 1, 'shopping_list')
    }

    function moveToArchive() {
        setMode('msg')
        setTimeout(() => {
            Items.changeLocation(props.item.id, 'archive')
            setMode('view')
        }, 500)
    }

    type ViewModes = 'view' | 'msg'
    const [ mode, setMode ] = createSignal<ViewModes>('view')

    function itemClass() {
        let cls = styles.item
        if( props.item.expiry != 'none' && props.item.location != 'shopping_list' ) {
            const days = differenceInCalendarDays(
                new Date(props.item.expiry), new Date()
            )
            if( days <= 0 ) { cls += ' ' + styles.expired }
            if( days <= 4 ) { cls += ' ' + styles.expire_warning }
        }
        return cls
    }

    return <section class={itemClass()}>

        <Show when={ mode() === 'msg' }>
            <p style='margin: 0; margin-left: 73px'> Item archived! </p>
        </Show>

        <Show when={ mode() === 'view' }>

            <Show when={props.item.location !== 'archive'}>
                <button
                    class={styles.action + ' iconbtn'}
                    onclick={moveToArchive}
                    title='Archive Item'
                >
                    { icons.cross() }
                </button>
            </Show>

            <Show when={['inventory', 'archive'].includes(props.item.location)}>
                <button
                    class={styles.action + ' iconbtn ' + styles.cartbtn}
                    onclick={addToShoppingList}
                    title={'Add to ' + Items.locationDisplay('shopping_list')}
                >
                    { icons.cart() }
                </button>
            </Show>

            <Show when={['shopping_list', 'archive'].includes(props.item.location)}>
                <button
                    class={styles.action + ' iconbtn'}
                    onclick={moveToInventory}
                    title={'Move to ' + Items.locationDisplay('inventory')}
                >
                    { icons.tick() }
                </button>
            </Show>

            <Show when={props.item.location == 'archive'}>
                <button onclick={deleteItem}>Delete</button>
            </Show>

            <CountInput value={props.item.count} onchange={updateCount} />
            <TextInput class={styles.name} value={props.item.name} onchange={updateName} />

            <Show when={props.item.location !== 'shopping_list'}>
                <ExpiryInput class={styles.action} value={props.item.expiry} onchange={updateExpiry} />
            </Show>
        </Show>

    </section>
};


