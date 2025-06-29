import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ForestAnimationsProps {
  type: 'leaves' | 'petals' | 'lightRays' | 'mist' | 'sparkles';
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

export default function ForestAnimations({ type, intensity = 'medium', children }: ForestAnimationsProps) {
  const { theme } = useTheme();
  
  const getParticleCount = () => {
    const counts = { low: 4, medium: 7, high: 12 };
    return counts[intensity];
  };

  const renderLeaves = () => {
    const leaves = Array.from({ length: getParticleCount() }, (_, i) => (
      <FallingLeaf key={i} delay={i * 1800} theme={theme} />
    ));
    return <View style={styles.particleContainer}>{leaves}</View>;
  };

  const renderPetals = () => {
    const petals = Array.from({ length: getParticleCount() }, (_, i) => (
      <DriftingPetal key={i} delay={i * 1200} theme={theme} />
    ));
    return <View style={styles.particleContainer}>{petals}</View>;
  };

  const renderLightRays = () => {
    return <LightRays theme={theme} intensity={intensity} />;
  };

  const renderMist = () => {
    return <MistEffect theme={theme} intensity={intensity} />;
  };

  const renderSparkles = () => {
    const sparkles = Array.from({ length: getParticleCount() }, (_, i) => (
      <FloatingSparkle key={i} delay={i * 800} theme={theme} />
    ));
    return <View style={styles.particleContainer}>{sparkles}</View>;
  };

  return (
    <View style={styles.container}>
      {children}
      {type === 'leaves' && renderLeaves()}
      {type === 'petals' && renderPetals()}
      {type === 'lightRays' && renderLightRays()}
      {type === 'mist' && renderMist()}
      {type === 'sparkles' && renderSparkles()}
    </View>
  );
}

// Enhanced Falling Leaf Component
function FallingLeaf({ delay, theme }: { delay: number; theme: any }) {
  const translateY = useRef(new Animated.Value(-60)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Reset values with random positioning
      translateY.setValue(-60);
      translateX.setValue(Math.random() * width);
      rotate.setValue(0);
      opacity.setValue(0);
      scale.setValue(0.3 + Math.random() * 0.7);

      // Enhanced animation sequence
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.6 + Math.random() * 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 0.8 + Math.random() * 0.4,
            tension: 30,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height + 80,
            duration: 10000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: translateX._value + (Math.random() - 0.5) * 150,
            duration: 10000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 720 + Math.random() * 360,
            duration: 10000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(startAnimation, 2000 + Math.random() * 8000);
      });
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const leafColors = [
    theme.colors.pastel.mint,
    theme.colors.pastel.sage,
    theme.colors.pastel.lavender,
    theme.colors.pastel.peach,
  ];
  const leafColor = leafColors[Math.floor(Math.random() * leafColors.length)];

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
            { rotate: rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }) },
          ],
          opacity,
        },
      ]}
    >
      <View style={[styles.leaf, { backgroundColor: leafColor }]}>
        <View style={[styles.leafVein, { backgroundColor: theme.colors.pastel.cream }]} />
      </View>
    </Animated.View>
  );
}

// Enhanced Drifting Petal Component
function DriftingPetal({ delay, theme }: { delay: number; theme: any }) {
  const translateX = useRef(new Animated.Value(-30)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      translateX.setValue(-30);
      translateY.setValue(Math.random() * height * 0.8);
      opacity.setValue(0);
      scale.setValue(0.3 + Math.random() * 0.4);
      rotate.setValue(0);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 0.6 + Math.random() * 0.6,
            tension: 20,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: width + 30,
            duration: 15000 + Math.random() * 8000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: translateY._value + (Math.random() - 0.5) * 300,
            duration: 15000 + Math.random() * 8000,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 360 + Math.random() * 180,
            duration: 15000 + Math.random() * 8000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(startAnimation, 3000 + Math.random() * 10000);
      });
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const petalColors = [
    theme.colors.pastel.pink,
    theme.colors.pastel.lavender,
    theme.colors.pastel.rose,
    theme.colors.pastel.lilac,
  ];
  const petalColor = petalColors[Math.floor(Math.random() * petalColors.length)];

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateX }, 
            { translateY }, 
            { scale },
            { rotate: rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }) },
          ],
          opacity,
        },
      ]}
    >
      <View style={[styles.petal, { backgroundColor: petalColor }]}>
        <View style={[styles.petalCenter, { backgroundColor: theme.colors.pastel.cream }]} />
      </View>
    </Animated.View>
  );
}

// Enhanced Light Rays Component
function LightRays({ theme, intensity }: { theme: any; intensity: string }) {
  const opacity = useRef(new Animated.Value(0.2)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const getIntensityValues = () => {
    switch (intensity) {
      case 'low': return { maxOpacity: 0.3, duration: 6000 };
      case 'high': return { maxOpacity: 0.7, duration: 3000 };
      default: return { maxOpacity: 0.5, duration: 4500 };
    }
  };

  const { maxOpacity, duration } = getIntensityValues();

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: maxOpacity,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.1,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

  return (
    <Animated.View style={[styles.lightRaysContainer, { opacity, transform: [{ scale }] }]}>
      <View style={[styles.lightRay, styles.ray1, { backgroundColor: theme.colors.pastel.peach }]} />
      <View style={[styles.lightRay, styles.ray2, { backgroundColor: theme.colors.pastel.blue }]} />
      <View style={[styles.lightRay, styles.ray3, { backgroundColor: theme.colors.pastel.lavender }]} />
      <View style={[styles.lightRay, styles.ray4, { backgroundColor: theme.colors.pastel.mint }]} />
      <View style={[styles.lightRay, styles.ray5, { backgroundColor: theme.colors.pastel.cream }]} />
    </Animated.View>
  );
}

// Enhanced Mist Effect Component
function MistEffect({ theme, intensity }: { theme: any; intensity: string }) {
  const translateX1 = useRef(new Animated.Value(-width)).current;
  const translateX2 = useRef(new Animated.Value(-width * 1.5)).current;
  const translateX3 = useRef(new Animated.Value(-width * 0.8)).current;
  const opacity = useRef(new Animated.Value(0.1)).current;

  const getIntensityValues = () => {
    switch (intensity) {
      case 'low': return { maxOpacity: 0.2, speed1: 25000, speed2: 30000, speed3: 35000 };
      case 'high': return { maxOpacity: 0.5, speed1: 15000, speed2: 18000, speed3: 22000 };
      default: return { maxOpacity: 0.3, speed1: 20000, speed2: 25000, speed3: 28000 };
    }
  };

  const { maxOpacity, speed1, speed2, speed3 } = getIntensityValues();

  useEffect(() => {
    const mistAnimation1 = Animated.loop(
      Animated.timing(translateX1, {
        toValue: width,
        duration: speed1,
        useNativeDriver: true,
      })
    );

    const mistAnimation2 = Animated.loop(
      Animated.timing(translateX2, {
        toValue: width,
        duration: speed2,
        useNativeDriver: true,
      })
    );

    const mistAnimation3 = Animated.loop(
      Animated.timing(translateX3, {
        toValue: width,
        duration: speed3,
        useNativeDriver: true,
      })
    );

    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: maxOpacity,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.05,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    );

    mistAnimation1.start();
    mistAnimation2.start();
    mistAnimation3.start();
    opacityAnimation.start();

    return () => {
      mistAnimation1.stop();
      mistAnimation2.stop();
      mistAnimation3.stop();
      opacityAnimation.stop();
    };
  }, []);

  return (
    <Animated.View style={[styles.mistContainer, { opacity }]}>
      <Animated.View
        style={[
          styles.mistLayer,
          styles.mist1,
          { 
            backgroundColor: theme.colors.pastel.blue,
            transform: [{ translateX: translateX1 }] 
          }
        ]}
      />
      <Animated.View
        style={[
          styles.mistLayer,
          styles.mist2,
          { 
            backgroundColor: theme.colors.pastel.lavender,
            transform: [{ translateX: translateX2 }] 
          }
        ]}
      />
      <Animated.View
        style={[
          styles.mistLayer,
          styles.mist3,
          { 
            backgroundColor: theme.colors.pastel.cream,
            transform: [{ translateX: translateX3 }] 
          }
        ]}
      />
    </Animated.View>
  );
}

// New Floating Sparkle Component
function FloatingSparkle({ delay, theme }: { delay: number; theme: any }) {
  const translateY = useRef(new Animated.Value(height + 20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.2)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      translateY.setValue(height + 20);
      translateX.setValue(Math.random() * width);
      opacity.setValue(0);
      scale.setValue(0.2);
      rotate.setValue(0);

      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -40,
            duration: 12000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: translateX._value + (Math.random() - 0.5) * 100,
            duration: 12000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.6 + Math.random() * 0.8,
            duration: 12000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 720,
            duration: 12000 + Math.random() * 6000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(startAnimation, 5000 + Math.random() * 10000);
      });
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const sparkleColors = [
    theme.colors.pastel.pink,
    theme.colors.pastel.lavender,
    theme.colors.pastel.blue,
    theme.colors.pastel.mint,
  ];
  const sparkleColor = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
            { rotate: rotate.interpolate({
              inputRange: [0, 720],
              outputRange: ['0deg', '720deg'],
            }) },
          ],
          opacity,
        },
      ]}
    >
      <View style={[styles.sparkle, { backgroundColor: sparkleColor }]}>
        <View style={[styles.sparkleCore, { backgroundColor: theme.colors.pastel.cream }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
  },
  leaf: {
    width: 16,
    height: 10,
    borderRadius: 8,
    opacity: 0.8,
    position: 'relative',
  },
  leafVein: {
    position: 'absolute',
    width: 1,
    height: 8,
    top: 1,
    left: 7,
    opacity: 0.6,
  },
  petal: {
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.7,
    position: 'relative',
  },
  petalCenter: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    top: 4.5,
    left: 4.5,
    opacity: 0.8,
  },
  sparkle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.9,
    position: 'relative',
  },
  sparkleCore: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    top: 3,
    left: 3,
  },
  lightRaysContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  lightRay: {
    position: 'absolute',
    width: 3,
    opacity: 0.4,
    borderRadius: 1.5,
  },
  ray1: {
    height: height * 0.7,
    top: 0,
    left: width * 0.15,
    transform: [{ rotate: '12deg' }],
  },
  ray2: {
    height: height * 0.5,
    top: height * 0.1,
    left: width * 0.4,
    transform: [{ rotate: '-8deg' }],
  },
  ray3: {
    height: height * 0.6,
    top: height * 0.15,
    left: width * 0.65,
    transform: [{ rotate: '15deg' }],
  },
  ray4: {
    height: height * 0.4,
    top: height * 0.2,
    left: width * 0.8,
    transform: [{ rotate: '-5deg' }],
  },
  ray5: {
    height: height * 0.3,
    top: height * 0.3,
    left: width * 0.25,
    transform: [{ rotate: '20deg' }],
  },
  mistContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  mistLayer: {
    position: 'absolute',
    height: 120,
    width: width * 1.8,
    borderRadius: 60,
    opacity: 0.3,
  },
  mist1: {
    top: height * 0.2,
  },
  mist2: {
    top: height * 0.5,
    height: 100,
  },
  mist3: {
    top: height * 0.75,
    height: 80,
  },
});