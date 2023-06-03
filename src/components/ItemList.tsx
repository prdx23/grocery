
import { Component, createSignal, For, Show } from 'solid-js';

import { Item, Items } from './Item'
import { ItemView } from './ItemView'
import styles from './css/ItemList.module.css';


const ItemList: Component<{ location: string }> = (props) => {

    const empty = <p class={styles.empty}> No items here! </p>

    return <section class={styles.itemlist}>
        <p class={styles.heading}> { props.location } </p>
        <ul>
            <For each={Items.list(props.location)} fallback={empty}>
                { (item, i) => <li>
                    <ItemView item={item} index={i()} />
                </li> }
            </For>
        </ul>
    </section>
};


export default ItemList;
