import { useEffect } from 'react';
import { AmbientGlow } from './components/AmbientGlow/AmbientGlow';
import { GuideLines } from './components/GuideLines/GuideLines';
import { Nav } from './sections/Nav/Nav';
import { Hero } from './sections/Hero/Hero';
import { IntroPreview } from './sections/IntroPreview/IntroPreview';
import { Approach } from './sections/Approach/Approach';
import { FeaturedProject } from './sections/FeaturedProject/FeaturedProject';
import { Philosophy } from './sections/Philosophy/Philosophy';
import { AlwaysUpdated } from './sections/AlwaysUpdated/AlwaysUpdated';
import { Footer } from './sections/Footer/Footer';
import { startSmoothScroll } from './lib/smoothScroll';
import styles from './App.module.css';

function App() {
  useEffect(() => {
    return startSmoothScroll();
  }, []);

  return (
    <div className={styles.root}>
      <AmbientGlow />
      <GuideLines />
      <Nav />
      <main>
        <Hero />
        <IntroPreview />
        <Approach />
        <FeaturedProject />
        <Philosophy />
        <AlwaysUpdated />
      </main>
      <Footer />
    </div>
  );
}

export default App;
