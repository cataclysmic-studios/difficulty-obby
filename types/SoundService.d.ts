interface SoundService extends Instance {
  LobbyMusic: SoundGroup;
  ZoneMusic: SoundGroup;
  Boombox: SoundGroup;
  SoundEffects: SoundGroup & {
    TimerTick: Sound;
    TimerStep: Sound;
    NukeAlarm: Sound;
    NukeFall: Sound;
    NukeExplode: Sound;
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