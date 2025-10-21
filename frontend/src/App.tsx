import { Toaster } from 'react-hot-toast';
import Landing from './components/Landing';

function App() {
  return (
    <div className="App">
      <Landing />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
