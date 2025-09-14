import './App.css'
import { MapView } from './components/MapView'
import { BottomSheet } from './components/BottomSheet'
import { MiniMap } from './components/MiniMap'

function App() {
  return (
    <div className="app-root">
      <MapView />
      <MiniMap />
      <BottomSheet />
    </div>
  )
}

export default App
