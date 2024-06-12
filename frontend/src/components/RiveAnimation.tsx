import React from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const RiveAnimation: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rive, RiveComponent } = useRive({
    src: 'frontend/src/assets/food_loading_animation.riv', // Updated path to your Rive file
    animations: 'Animation 1', // Replace with your animation name
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return <RiveComponent style={{ width: '100%', height: '300px' }} />;
};

export default RiveAnimation;
