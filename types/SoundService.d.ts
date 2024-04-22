interface SoundService extends Instance {
  Music: SoundGroup;
  SoundEffects: SoundGroup & {
    GainCoins: Sound;
    StageCompleted: Sound;
    WindAmbience: Sound;
    ZoneDiscovered: Sound;
  };
}