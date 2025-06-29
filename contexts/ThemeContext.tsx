import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

// Define the Theme interface
export interface Theme {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
    pastel: {
      blue: string;
      pink: string;
      lavender: string;
      mint: string;
      peach: string;
      cream: string;
      sage: string;
      rose: string;
      lilac: string;
      powder: string;
    };
    forest: {
      moss: string;
      fern: string;
      earth: string;
      beige: string;
      sky: string;
      amber: string;
      floral: string;
      lavender: string;
    };
    gradient: {
      primary: string[];
      secondary: string[];
      accent: string[];
      forest: string[];
      nature: string[];
      pastel: string[];
      dreamy: string[];
      sunset: string[];
      ocean: string[];
    };
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: '#FDF8FF',
    surface: '#FFFFFF',
    primary: '#C8B5E8',
    secondary: '#F4C2C2',
    accent: '#B8E6D3',
    text: '#4A4458',
    textSecondary: '#6B6B7D',
    border: '#F0E8F5',
    shadow: '#000000',
    pastel: {
      blue: '#B8D5E8',
      pink: '#F4C2C2',
      lavender: '#C8B5E8',
      mint: '#B8E6D3',
      peach: '#F5D5C2',
      cream: '#FFF8F0',
      sage: '#C8D5B9',
      rose: '#E8C5D1',
      lilac: '#D8C5E8',
      powder: '#E8D5F0',
    },
    forest: {
      moss: '#B8E6D3',
      fern: '#A8D5B8',
      earth: '#D4C5B0',
      beige: '#F5F1E9',
      sky: '#B8D5E8',
      amber: '#F5D5C2',
      floral: '#F4C2C2',
      lavender: '#C8B5E8',
    },
    gradient: {
      primary: ['#C8B5E8', '#FDF8FF'],
      secondary: ['#F4C2C2', '#FDF8FF'],
      accent: ['#B8E6D3', '#FDF8FF'],
      forest: ['#B8E6D3', '#C8B5E8'],
      nature: ['#A8D5B8', '#F4C2C2'],
      pastel: ['#C8B5E8', '#F4C2C2', '#B8E6D3'],
      dreamy: ['#F4C2C2', '#C8B5E8', '#B8E6D3'],
      sunset: ['#F5D5C2', '#F4C2C2', '#C8B5E8'],
      ocean: ['#B8D5E8', '#B8E6D3', '#C8B5E8'],
    },
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: '#2A2438',
    surface: '#3A3248',
    primary: '#A89BC7',
    secondary: '#C89BB8',
    accent: '#9BC7B3',
    text: '#F0F0F5',
    textSecondary: '#C8C8D3',
    border: '#4A4458',
    shadow: '#000000',
    pastel: {
      blue: '#9BB8C7',
      pink: '#C89BB8',
      lavender: '#A89BC7',
      mint: '#9BC7B3',
      peach: '#C7B59B',
      cream: '#D3CFC8',
      sage: '#A8B599',
      rose: '#C8A5B1',
      lilac: '#B8A5C7',
      powder: '#C7B5D0',
    },
    forest: {
      moss: '#9BC7B3',
      fern: '#8BB598',
      earth: '#B4A58A',
      beige: '#C8C4BD',
      sky: '#9BB8C7',
      amber: '#C7B59B',
      floral: '#C89BB8',
      lavender: '#A89BC7',
    },
    gradient: {
      primary: ['#A89BC7', '#2A2438'],
      secondary: ['#C89BB8', '#2A2438'],
      accent: ['#9BC7B3', '#2A2438'],
      forest: ['#9BC7B3', '#A89BC7'],
      nature: ['#8BB598', '#C89BB8'],
      pastel: ['#A89BC7', '#C89BB8', '#9BC7B3'],
      dreamy: ['#C89BB8', '#A89BC7', '#9BC7B3'],
      sunset: ['#C7B59B', '#C89BB8', '#A89BC7'],
      ocean: ['#9BB8C7', '#9BC7B3', '#A89BC7'],
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize theme based on system preference
    const colorScheme = Appearance.getColorScheme();
    setIsDark(colorScheme === 'dark');

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}