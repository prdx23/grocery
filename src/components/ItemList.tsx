
import { Component, For, Show } from 'solid-js';

import { Item, Items } from './Item'
import { ItemView } from './ItemView'
import { TextInput } from './TextInput';
import icons from '../icons';
import styles from './css/ItemList.module.css';



type ItemListProps = {
    location: string,
    onDeleteLocation: () => void,
    onChangeLocation: (x: string) => void,
}
const ItemList: Component<ItemListProps> = (props) => {

    const empty = <p class={styles.empty}> No items here! </p>

    function deleteLocation() {
        if( Items.deleteLocation(props.location) ) {
            props.onDeleteLocation()
        }
    }

    function changeLocation(newLocation: string) {
        if( Items.changeLocationName(props.location, newLocation) ) {
            props.onChangeLocation(newLocation)
        }
    }

    const blacklist = ['Inventory', 'Archive', 'Shopping List']

    return <section class={styles.itemlist}>
        <div class={styles.header}>
            <Show when={blacklist.includes(props.location)}>
                <p class={styles.heading}> { props.location } </p>
            </Show>
            <Show when={!blacklist.includes(props.location)}>
                <TextInput
                    class={styles.heading_input}
                    value={props.location}
                    onchange={() => {}}
                    placeholder='Location Name'
                    onsubmit={changeLocation}
                />
                <button
                    class={styles.action + ' iconbtn'}
                    onclick={deleteLocation}
                    title='Delete this location'
                >
                    { icons.cross() }
                </button>
            </Show>
        </div>
        <ul>
            <For each={Items.list(props.location)} fallback={empty}>
                { (item, i) => <li>
                    <ItemView item={item} id={i()} location={props.location} />
                </li> }
            </For>
        </ul>
    </section>
}


export default ItemList
