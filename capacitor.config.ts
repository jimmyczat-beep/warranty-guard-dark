import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.a7ee81c419b04cb6a5ac0144d25fc02d',
  appName: 'Receipt Tracker',
  webDir: 'dist',
  server: {
    url: 'https://a7ee81c4-19b0-4cb6-a5ac-0144d25fc02d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;