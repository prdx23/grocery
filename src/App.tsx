import type { Component } from 'solid-js';
import { createSignal, For } from 'solid-js';

import styles from './App.module.css';

import ItemList from './components/ItemList';
import AddItemView from './components/AddItemView';
import { Items } from './components/Item'
import type { LocationString } from './components/Item'


const App: Component = () => {

    const [
        activeLocation, setActiveLocation
    ] = createSignal<LocationString>('inventory')

    return <main class={styles.App}>

        <div id='modal'></div>

        <AddItemView />

        <section class={styles.locationswitcher}>
            <For each={Items.locationKeys()}>
                { (location) =>
                <button onclick={() => setActiveLocation(location)}>
                    { Items.locationDisplay(location) }
                </button> }
            </For>
        </section>

        <section class={styles.view}>
            <section class={styles.left}>
                <ItemList location={ activeLocation() } />
            </section>
            <section class={styles.right}>
                <ItemList location='shopping_list' />
            </section>
        </section>


    </main>
};


export default App;
