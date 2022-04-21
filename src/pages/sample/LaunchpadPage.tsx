import React, { useEffect } from 'react';
import BackgroundImage from '../../components/common/BackgroundImage';
import TopFullWidthImage from '../../components/common/TopFullWidthImage';
import { useStore } from '../../contexts/StoreProvider';

const LaunchpadPage = () => {
  const { appBarStore } = useStore();

  useEffect(() => {
    appBarStore.turnOnTransparency();
    return () => {
      appBarStore.turnOffTransparency();
    };
  }, []);

  return (
    <div style={{ height: '1200px', backgroundColor: 'rgba(255, 255, 128, .5)' }}>
      <BackgroundImage src={'/sample/images/sample_image_1920_1080.jpg'} minWidth={1920} minHeight={1080} />
      <TopFullWidthImage src={'/sample/images/sample_image_1920_1080.jpg'} />
      start
      <h1>Launchpad</h1>
      {/* <Footer /> */}
    </div>
  );
};

export default LaunchpadPage;
