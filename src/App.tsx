import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CurrencyConverter from './components/CurrencyConverter'
import WorldMap from './components/WorldMap'
import Learn from './components/Learn'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CurrencyConverter />
        <WorldMap />
        <Learn />
      </main>
      <Footer />
    </>
  )
}

export default App