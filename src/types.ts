export interface Track {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  coverImage?: string;
  moodTag: string;
  quoteSnippet: string;
}

export interface LateNightThought {
  id: string;
  text: string;
  theme: 'nostalgia' | 'solitude' | 'peace' | 'dreams' | 'overthinking';
  timeContext: string; // e.g. "03:14 AM", "03:42 AM"
  moodBg?: string;
}

export type WeatherMode = 'rain' | 'winter' | 'clear';

export type MidnightMood = 'cozy' | 'melancholy' | 'peaceful' | 'reflective' | 'dreamy';

export interface PlaylistSubmission {
  id: string;
  type: 'song' | 'thought' | 'both';
  songTitle?: string;
  songArtist?: string;
  songLink?: string;
  thoughtText?: string;
  moodTag: string;
  submitterName?: string;
  timestamp: string;
  status: 'pending' | 'reviewing' | 'approved';
}

export interface AmbientState {
  rainVolume: number;
  snowWindVolume: number;
  isPlaying: boolean;
}

