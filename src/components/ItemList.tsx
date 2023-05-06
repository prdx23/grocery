import { For } from 'solid-js';

import styles from './ItemList.module.css';

import type { Item, LocationString } from './Item'
import { Items, ItemView } from './Item'



const ItemList = (props: { location: LocationString }) => {

    const empty = <p class={styles.empty}> No items here! </p>

    return <section class={styles.itemlist}>
        <p class={styles.heading}>
            { Items.locationDisplay(props.location) }
        </p>
        <ul>
            <For each={Items.list(props.location)} fallback={empty}>
                { (item) => <li> <ItemView item={item} /> </li> }
            </For>
        </ul>
    </section>
};


export default ItemList;
