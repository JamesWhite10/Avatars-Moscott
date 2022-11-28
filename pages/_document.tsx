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
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
