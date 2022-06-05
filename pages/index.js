import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const apiurls = {
  "domain" : "rickandmortyapi.com",
  "base": "https://rickandmortyapi.com/api",
  "episodes": "https://rickandmortyapi.com/api/episode",
  "characters": "https://rickandmortyapi.com/api/character",
  "github": "https://api.github.com/users/ouzsrcm",
  "unknown": "https://rickandmortyapi.com/api/unknown"
}

export async function getServerSideProps() {
  const data = await fetch(apiurls.characters).then(res => res.json())
  return {
    props: {
      data
    }
  }
}

export default function Home({data}) {
  const {info, results: defaultResults = [] } = data
  //console.log(data);
  const [results, updateResults] = useState(defaultResults)
  const [page, updatePage] = useState({
    ...info,
    current: apiurls.characters
  })
  const {current} = page
  useEffect(()=> {
    if(current === apiurls.characters) {
      return
    }

    async function request(){
      const res = await fetch(current).then(res => res.json())

      updatePage({
        current,
        ...res.info
      })

      if(!res.info?.prev){
        updateResults(res.results)
        return
      }

      updateResults(prev => {
        return [...prev, ...res.results]
      })

    }
    request()
  }, [current])

  function handleLoadMore(){
    updatePage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    })
  }

  function handleOnSubmitSearch(e){
    e.preventDefault()

    const {currentTarget = {} } = e

    const fields = Array.from(currentTarget?.elements)
    const fieldQuery = fields.find(field => field.name === "query")

    const value=fieldQuery.value || ""
    const url = `${apiurls.base}/character/?name=${value}`
    updatePage({
      current: url,
    })
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Rick & Morty</title>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <main className={styles.main}>

        <h1 className={styles.title}>
          Welcome to <a href="/">Rick & Morty</a>
        </h1>

        <form className={styles.search} onSubmit={handleOnSubmitSearch}>
          <input type="text" name='query' placeholder="Search" />
          <button type="submit">Search</button>
        </form>

        <div className={styles.grid}>
          {results.map((character) => {        
          return(
            <Link href='/character/[character.id]' as={`/character/${character.id}`} key={character.id}>
              <a className={styles.card} key={character.id}>
                <img src={character.image} />
                <h3>{character.name}</h3>
                <p>
                species: {character.species} <br />
                status: {character.status} <br />
                </p>
              </a>
            </Link>
          )
    })}
        </div>
        <p>
          <button onClick={handleLoadMore}>Load More</button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a href={apiurls.base} target="_blank" rel="noopener noreferrer">
          Powered by {apiurls.domain}
        </a>
      </footer>
    </div>
  )
}
