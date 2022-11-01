export type MoveDirectionType = {
  secondTexture: number;
  firstTexture: number;
};

export interface MoveConstansOptionsType {
  [key: string]: {
    to: MoveDirectionType;
    from: MoveDirectionType;
  };
}

export const MoveConstant: MoveConstansOptionsType = {
  secondTexture: {
    from: {
      secondTexture: 0.0,
      firstTexture: 1.0,
    },
    to: {
      secondTexture: 1.0,
      firstTexture: 0.0,
    },
  },
  firstTexture: {
    from: {
      secondTexture: 1.0,
      firstTexture: 0.0,
    },
    to: {
      secondTexture: 0.0,
      firstTexture: 1.0,
    },
  },
};
