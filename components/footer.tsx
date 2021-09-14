import Container from './container'
import { EXAMPLE_PATH } from '../lib/constants'

const Footer = () => {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-5 flex justify-end">
          <a href={`https://github.com/tsuchikazu/blog`} className="mx-3 font-bold hover:underline">
            View on GitHub
          </a>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
