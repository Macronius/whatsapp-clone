import Head from 'next/head'
// import Image from 'next/image'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>whatsapp clone</title>
        <meta name="description" content="whatsapp clone, guided by Sonny Sangha" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
    </div>
  )
}
