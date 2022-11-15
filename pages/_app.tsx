import '../styles/globals.css';
import 'swiper/css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>New Bizzare Era</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, height=device-height"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
