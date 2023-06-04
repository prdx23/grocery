import { Component, createSignal, For } from 'solid-js';

import styles from './App.module.css';

import ItemList from './components/ItemList';
import AddItemView from './components/AddItemView';
import { Items } from './components/Item'
import icons from './icons';
import { Popup } from './components/Popup';


const App: Component = () => {

    const [ activeLocation, setActiveLocation ] = createSignal('Inventory')

    function locationButton(location: string) {
        return <button onclick={() => setActiveLocation(location)}>
            { location }
        </button>
    }


    return <main class={styles.App}>

        <Popup />

        <AddItemView />

        <section class={styles.locationswitcher}>
            <For each={Items.locations()}>
                { (location) =>
                <button onclick={() => setActiveLocation(location)}>
                    { location }
                </button> }
            </For>
            <button class='iconbtn'> { icons.plus() } </button>
        </section>


        {/* { JSON.stringify(Items.list('Inventory')) } */}

        {/* { JSON.stringify(Items.list('Shopping List')) } */}

        {/* { JSON.stringify(Items.locations()) } */}

        {/* <section class={styles.locationswitcher}> */}
        {/*     <For each={Items.locationKeys()}> */}
        {/*         { (location) => */}
        {/*         <button onclick={() => setActiveLocation(location)}> */}
        {/*             { Items.locationDisplay(location) } */}
        {/*         </button> } */}
        {/*     </For> */}
        {/* </section> */}

        <section class={styles.view}>
            <section class={styles.left}>
                <ItemList location={ activeLocation() } />
            </section>
            <section class={styles.right}>
                <ItemList location='Shopping List' />
            </section>
        </section>


    </main>
};


export default App;
