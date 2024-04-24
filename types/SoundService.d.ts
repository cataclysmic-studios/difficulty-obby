interface SoundService extends Instance {
  Music: SoundGroup;
  SoundEffects: SoundGroup & {
    AboutToFall: Sound;
    Falling: Sound;
    GainCoins: Sound;
    StageCompleted: Sound;
    WindAmbience: Sound;
    ZoneDiscovered: Sound;
    UIClick: Sound;
    UIHover: Sound;
    UIToggleSwitch: Sound;
    Notification: Sound;
  };
}