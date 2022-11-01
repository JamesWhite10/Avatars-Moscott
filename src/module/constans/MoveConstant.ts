export type CharacterDataFromOrTo = {
  secondTexture: number;
  firstTexture: number;
};

export interface MoveConstansOptions {
  secondTexture: {
    to: CharacterDataFromOrTo;
    from: CharacterDataFromOrTo;
  };
  firstTexture: {
    to: CharacterDataFromOrTo;
    from: CharacterDataFromOrTo;
  };
}

export const MoveConstant: MoveConstansOptions = {
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
