import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.goguide.agendamentos',
  appName: 'Guide',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: "notification_icon",
      iconColor: "#3BD9CA",
      // sound: "main_sound.wav"
    }
  },
};

export default config;
