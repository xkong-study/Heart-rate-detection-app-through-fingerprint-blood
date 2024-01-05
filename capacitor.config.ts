import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'photo-gallery',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    hostname: '192.168.2.1',
  }
};

export default config;
