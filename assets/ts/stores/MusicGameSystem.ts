interface LaneTemplate {
  name: string;
  color: string;
}

interface MusicGameSystem {
  name: string;
  laneTemplates: LaneTemplate[];
  noteTypes: { name: string; color: string }[];
}

export default MusicGameSystem;
