interface SoundService extends Instance {
  Music: SoundGroup;
  SoundEffects: SoundGroup & {
    ZoneDiscovered: Sound;
  };
}