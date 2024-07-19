import { NavBar } from './components/NavBar'; 
import { ItemListContainer } from './components/ItemListContainer'; 

function App() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <ItemListContainer
          greeting="Bienvenidos al espacio que investiga la conexión entre el Cielo y la Tierra a través de las Estrellas!"
        />
      </main>
    </>
  );
}

export default App;

