import crypto from 'crypto';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const cspHashOf = (text) => {
  const hash = crypto.createHash('sha256');
  hash.update(text);
  return `'sha256-${hash.digest('base64')}'`;
};

const ANALYTICS_CSP = {
  all: {
    connect: [
      'https://amazonwebservices.d2.sc.omtrdc.net',
      'https://aws.demdex.net',
      'https://dpm.demdex.net',
      'https://cm.everesttech.net'
    ],
    img: [
      'https://amazonwebservices.d2.sc.omtrdc.net',
      'https://aws.demdex.net',
      'https://dpm.demdex.net',
      'https://cm.everesttech.net'
    ],
    frame: ['https://aws.demdex.net', 'https://dpm.demdex.net']
  },
  prod: {
    connect: [
      'https://d2c.aws.amazon.com/',
      'https://vs.aws.amazon.com',
      'https://a0.awsstatic.com/',
      'https://aws.amazon.com/'
    ],
    img: ['https://a0.awsstatic.com/', 'https://d2c.aws.amazon.com/'],
    script: ['https://a0.awsstatic.com/', 'https://d2c.aws.amazon.com/']
  },
  alpha: {
    connect: [
      'https://aa0.awsstatic.com/',
      'https://alpha.d2c.marketing.aws.dev/',
      'https://aws-mktg-csds-alpha.integ.amazon.com/',
      'https://d2c-alpha.dse.marketing.aws.a2z.com'
    ],
    img: ['https://aa0.awsstatic.com/', 'https://alpha.d2c.marketing.aws.dev/'],
    script: [
      'https://aa0.awsstatic.com/',
      'https://alpha.d2c.marketing.aws.dev/'
    ]
  }
};

// CSP also set in customHttp.yml
const getCspContent = (context) => {
  const cspInlineScriptHash = cspHashOf(
    NextScript.getInlineScriptSource(context)
  );

  // Dev environment
  if (process.env.BUILD_ENV !== 'production') {
    return `upgrade-insecure-requests;
      default-src 'none';
      prefetch-src 'self';
      style-src 'self' 'unsafe-inline';
      font-src 'self' data:;
      frame-src 'self' https://www.youtube-nocookie.com ${ANALYTICS_CSP.all.frame.join(
        ' '
      )};
      connect-src 'self' *.shortbread.aws.dev ${ANALYTICS_CSP.all.connect.join(
        ' '
      )} ${ANALYTICS_CSP.alpha.connect.join(
      ' '
    )} https://*.algolia.net https://*.algolianet.com *.amazonaws.com;
      img-src 'self' https://img.shields.io data: ${ANALYTICS_CSP.all.img.join(
        ' '
      )} ${ANALYTICS_CSP.alpha.img.join(' ')}; 
      media-src 'self';
      script-src 'unsafe-eval' 'self' ${cspInlineScriptHash} ${ANALYTICS_CSP.alpha.script.join(
      ' '
    )};
    `;
  }

  // Prod environment
  // Have to keep track of CSP inside customHttp.yml as well
  return `upgrade-insecure-requests;
    default-src 'none';
    prefetch-src 'self';
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    frame-src 'self' https://www.youtube-nocookie.com ${ANALYTICS_CSP.all.frame.join(
      ' '
    )};
    connect-src 'self' *.shortbread.aws.dev ${ANALYTICS_CSP.all.connect.join(
      ' '
    )} ${ANALYTICS_CSP.prod.connect.join(
    ' '
  )} https://*.algolia.net https://*.algolianet.com *.amazonaws.com;
    img-src 'self' https://img.shields.io ${ANALYTICS_CSP.all.img.join(
      ' '
    )} ${ANALYTICS_CSP.prod.img.join(' ')};
    media-src 'self';
    script-src 'self' ${cspInlineScriptHash} ${ANALYTICS_CSP.prod.script.join(
    ' '
  )} ;
  `;
};

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            httpEquiv="Content-Security-Policy"
            content={getCspContent(this.props)}
          />
          <link
            rel="preload"
            href="/fonts/AmazonEmber_W_Rg.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/AmazonEmber_W_Lt.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
