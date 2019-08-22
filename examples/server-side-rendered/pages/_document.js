import Document, { Head, Main, NextScript } from 'next/document';

export default class DefaultDocument extends Document {
  render () {
    return (
      <html lang='en'>
        <head>
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <meta name='description' content='Example Server-side React App for BloomReach Experience' />
          <meta name='author' content='Robbert Kauffman, Solution Consultant, BloomReach' />

          <title>React App</title>

          <link rel='stylesheet' href={`${process.env.PUBLIC_URL}/static/bootstrap.min.css`} media='screen' />
          <link rel='stylesheet' href={`${process.env.PUBLIC_URL}/static/custom.css`} media='screen' />

          <Head />
        </head>
        <body>
          <div id='root'>
            <Main />
          </div>
          <footer>
            <p>&copy; 2018 BloomReach, Inc.</p>
          </footer>
          <NextScript />
        </body>
      </html>
    );
  }
}
