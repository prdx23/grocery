
import { For } from 'solid-js';

import { Items } from './Item'
import type { Item, LocationString } from './Item'
import { ItemView } from './ItemView'
import styles from './css/ItemList.module.css';


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
