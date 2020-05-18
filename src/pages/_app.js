import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Layout from '../components/Layout/'
import keys from '../config/keys'
import GlobalState from '../context/GlobalState'
import { initGA, logPageView } from '../utilities/analytics'
import postsContext from '../context/postsContext'
import keysContext from '../context/keysContext'
import settingsContext from '../context/settingsContext'
import pagesContext from '../context/postsContext'
import '../sass/main.scss'


const App = (props) => {

  const { pathname } = useRouter()
  let { Component, pages, posts, keys, settings, } = props
  const [gaInitialized, setGaInitialized] = useState(false)

  useEffect(() => {
    if (!gaInitialized) {
      setGaInitialized(true)
      initGA(keys.googleAnalyticsId)
    }
    if (gaInitialized) {
      logPageView()
    }
  }, [pathname])

  const foundPosts = useContext(postsContext)
  const foundPages = useContext(pagesContext)
  const foundKeys = useContext(keysContext)
  const foundSettings = useContext(settingsContext)

  return (
    <GlobalState
      pages={pages ? pages : foundPages.pages}
      posts={posts ? posts : foundPosts.posts}
      keys={keys ? keys : foundKeys.keys}
      settings={settings ? settings : foundSettings.settings}
    >
      <Layout>
        <Component {...props} />
      </Layout>
    </GlobalState>
  )
}


App.getInitialProps = async ({ Component, ctx }) => {

  let pageProps = {}
  const rootUrl = keys.rootURL ? keys.rootURL : ''

  // Run getInitialProps for each component
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  if (!!ctx.res) {
    
    const { data: publicKeys } = await axios.get(`${rootUrl}/api/utility/publicKeys`)
    pageProps.keys = publicKeys
  
    const { data: settings } = await axios.get(`${rootUrl}/api/utility/settings`)
    pageProps.settings = settings
  
    const { data: posts } = await axios.get(`${rootUrl}/api/posts/published`)
    pageProps.posts = posts
  
    const { data: pages } = await axios.get(`${rootUrl}/api/pages`)
    pageProps.pages = pages
  }


  return pageProps
}


export default App