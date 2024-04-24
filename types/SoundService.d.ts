interface SoundService extends Instance {
  Music: SoundGroup;
  SoundEffects: SoundGroup & {
    Boing: Sound;
    Portal: Sound;
    Wind: Sound;
    AboutToFall: Sound;
    Falling: Sound;
    GainCoins: Sound;
    StageCompleted: Sound;
    ZoneDiscovered: Sound;
    UIClick: Sound;
    UIHover: Sound;
    UIToggleSwitch: Sound;
    Notification: Sound;
  };
}