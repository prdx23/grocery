
import { Component, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { add, differenceInCalendarDays } from 'date-fns'

import { Item, ExpiryDate, Items } from './Item';
import { CountInput } from './CountInput';
import { TextInput } from './TextInput';
import { ExpiryInput } from './ExpiryInput';
import icons from '../icons';
import styles from './css/ItemView.module.css';
import { onLoseFocusDirective } from '../utils';
import { addPopup } from './Popup';
const onLoseFocus = onLoseFocusDirective


type ItemViewProps = { item: Item, id: number, location: string }
export const ItemView: Component<ItemViewProps> = (props) => {

    const [ selected, setSelected ] = createSignal(false)

    function moveToArchive() {
        Items.add('Archive', {...props.item})
        Items.delete(props.location, props.id)
        addPopup('Item Archived!')
    }

    function moveToInventory() {
        Items.add('Inventory', {...props.item})
        Items.delete(props.location, props.id)
        addPopup('Moved to Inventory!')
    }

    function addToShoppingList() {
        Items.add('Shopping List', {...props.item, count: 1, expiry: 'none'})
        addPopup('Added to Shopping List!')
    }

    const itemClasses = () => {
        let days
        if( props.item.expiry != 'none' && props.location != 'Shopping List' ) {
            days = differenceInCalendarDays(
                new Date(props.item.expiry), new Date()
            )
        }
        return {
            [styles.item]: true,
            [styles.selected]: selected(),
            [styles.show_expiry]: days !== undefined && days <= 30,
            [styles.expire_warning]: days !== undefined && days <= 4,
            [styles.expired]: days !== undefined && days <= 0,
        }
    }

    return <section
        classList={itemClasses()}
        onclick={() => setSelected(true)}
        use:onLoseFocus={() => setSelected(false)}
    >

        <Show when={props.location == 'Archive'}>
            <button
                class={styles.action}
                onclick={() => Items.delete(props.location, props.id)}
                title='Delete'
            >
                Delete
            </button>
        </Show>

        <Show when={props.location !== 'Archive'}>
            <button
                class={styles.action + ' iconbtn'}
                onclick={moveToArchive}
                title='Archive Item'
            >
                { icons.cross() }
            </button>
        </Show>

        <Show when={['Shopping List', 'Archive'].includes(props.location)}>
            <button
                class={styles.action + ' iconbtn'}
                onclick={moveToInventory}
                title={'Move to Inventory'}
            >
                { icons.tick() }
            </button>
        </Show>

        <Show when={Items.locations().includes(props.location)}>
            <button
                class={styles.action + ' iconbtn ' + styles.cartbtn}
                onclick={addToShoppingList}
                title={'Add to Shopping List'}
            >
                { icons.cart() }
            </button>
        </Show>

        <CountInput
            value={props.item.count}
            onchange={(x) => Items.updateCount(props.location, props.id, x)}
        />

        <TextInput
            class={styles.name}
            value={props.item.name}
            onchange={(x) => Items.updateName(props.location, props.id, x)}
        />

        <Show when={props.location !== 'Shopping List'}>
            <ExpiryInput
                class={styles.expiry_display}
                value={props.item.expiry}
                onchange={(x) => Items.updateExpiry(props.location, props.id, x)}
            />
        </Show>

        <button
            class={styles.action + ' iconbtn'}
            onclick={() => Items.moveUp(props.location, props.id)}
        >
            { icons.up() }
        </button>

        <button
            class={styles.action + ' iconbtn'}
            onclick={() => Items.moveDown(props.location, props.id)}
        >
            { icons.down() }
        </button>

    </section>
}
