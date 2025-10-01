import Button from "../components/Button";
import About from './AboutUs.jsx';

function Home() {


  return (
    <>
      <div>
        <Button title="hola mundo"/>
        <About />
      </div>
          <div className="bg-background min-h-screen">
      <AboutUs />
    </div>
    </>
  )
}



export default Home
