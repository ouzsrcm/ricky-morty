import Head from 'next/head'
import styles from '../../../styles/Home.module.css'

const apiurls = {
  "domain" : "rickandmortyapi.com",
  "base": "https://rickandmortyapi.com/api",
  "episodes": "https://rickandmortyapi.com/api/episode",
  "characters": "https://rickandmortyapi.com/api/character",
  "github": "https://api.github.com/users/ouzsrcm",
  "unknown": "https://rickandmortyapi.com/api/unknown"
}

export async function getServerSideProps({query}) {
  const {id} = query
  const data = await fetch(`${apiurls.characters}/${id}`).then(res => res.json())
  return {
    props: {
      data
    }
  }
}

export default function Character({data}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rick & Morty</title>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <main className={styles.character}>
        <h1 className={styles.title}>
          Welcome to <a href="/">Rick & Morty</a>
        </h1>

        <div className={styles.grid}>
            <div className={styles.left}>
                <img src={data.image} alt={data.name} />
            </div>
            <div className={styles.right}>
                <ul>
                    <li>name {data.name}</li>
                    <li>status {data.status}</li>
                    <li>spacies {data.species}</li>
                    <li>type {data.type}</li>
                    <li>gender {data.gender}</li>
                    <li>origin {data.origin.name} {data.origin.url}</li>
                    <li>location {data.location.name} {data.location.url}</li>
                    <li>url {data.url}</li>
                    <li>created {data.created}</li>
                    <li>episodes {data.episode.length}</li>
                </ul>
            </div>
            <div className={styles.clear}></div>
            <h4>episodes</h4>
            <div>
                <ol>
                    {data.episode.map(item => {
                        return (
                            <li key={item}>{item}</li>
                        )
                    })}
                </ol>
            </div>
        </div>
        
      </main>

      <footer className={styles.footer}>
        <a href={apiurls.base} target="_blank" rel="noopener noreferrer">
          Powered by {apiurls.domain}
        </a>
      </footer>
    </div>
  )
}