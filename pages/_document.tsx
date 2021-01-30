import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import { ColorModeScript } from '../components/color-mode-script'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript initialColorMode={'system'} />
          <Main />
          <NextScript />

          <style jsx global>{`
            #__next {
              height: 100%;
              flex: 1;
              display: flex;
              flex-direction: column;
            }
          `}</style>
        </body>
      </Html>
    )
  }
}

export default MyDocument
