export interface LaneTemplate {
  name: string;
  color: string;
  division: number;
}

interface MusicGameSystem {
  name: string;
  laneTemplates: LaneTemplate[];
  noteTypes: { name: string; color: string; renderer: string }[];
}

export default MusicGameSystem;
