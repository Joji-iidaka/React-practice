import './App.css';

import { useEffect } from'react';
import { useState } from'react';
import { getAllPokemon } from './utils/pokemon.js';
import { getPokemon } from './utils/pokemon.js';
import Card from './components/Card/Card.js';
import Navbar from './components/NavBar/NavBar.js';

function App() {
  const initialURL = 'https://pokeapi.co/api/v2/pokemon';
  const [loading,setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL,setNextURL] = useState("");
  const [prevURL,setPrevURL] = useState("");
  const [page,setPage] = useState(1);

  useEffect(() => {
    const fetchPokemonData = async () => {
      // すべてのポケモンデータ取得
      let res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細な情報を取得
      loadPokemon(res.results);
      console.log(res);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  },[]);

  const loadPokemon = async (data) => {
    // Promiss.allで複数のリクエストを同時に行う(すべて取得するまで待つ)
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    )
    setPokemonData(_pokemonData);
  }

  // console.log(pokemonData);

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    console.log(data);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setPage(prevState => prevState + 1);
    setLoading(false);
  }
  const handlePrevPage = async () => {
    if(!prevURL)return
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    console.log(data);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setPage(prevState => prevState - 1);
    setLoading(false);
  }

  return (
    <>
    <Navbar page={page}/>
    <div className="App">
      {loading ? (
        <h1>loading...</h1>
      ) : (
        <>
          <div className="pokemonCardContainer">
            {pokemonData.map((pokemon,i) => {
              return <Card key={i} pokemon={pokemon} />;
            })}
          </div>
          <div className="btn">
            {prevURL ? (
              <button onClick={handlePrevPage}>前へ</button>
            ) : (
              <button disabled>前へ</button>
            )}
            {nextURL ? (
              <button onClick={handleNextPage}>次へ</button>
            ) : (
              <button disabled>次へ</button>
            )}
          </div>
        </>
      )}
    </div>;
    </>
  );
}
export default App;