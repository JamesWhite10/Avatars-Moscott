import { Head, Html, Main, NextScript } from 'next/document';
import React, { ReactElement } from 'react';

export default function Document(): ReactElement {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, height=device-height"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
