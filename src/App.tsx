import { Component, createSignal } from 'solid-js';

import styles from './App.module.css';

import ItemList from './components/ItemList';
import AddItemView from './components/AddItemView';
import { Items } from './components/Item'
import icons from './icons';
import { Popup } from './components/Popup';
import LocationSwitcher from './components/LocationSwitcher';


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
        <LocationSwitcher onchange={setActiveLocation} />

        <section class={styles.view}>
            <section class={styles.left}>
                <ItemList
                    location={activeLocation()}
                    onDeleteLocation={() => setActiveLocation('Inventory')}
                    onChangeLocation={(x) => setActiveLocation(x)}
                />
            </section>
            <section class={styles.right}>
                <ItemList
                    location='Shopping List'
                    onDeleteLocation={() => {}}
                    onChangeLocation={() => {}}
                />
            </section>
        </section>


    </main>
};


export default App;
