import dataImageURL from "./data.png";
import { backward, forward } from "./map";

export function loadData(): Promise<Uint8ClampedArray> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas")!;
      const { width, height } = image;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, width, height);
      const arr = new Uint8ClampedArray(width * height * 3);
      let o = 0;
      const data = imageData.data;
      for (let i = 0; i < data.length; ) {
        arr[o++] = data[i++];
        arr[o++] = data[i++];
        arr[o++] = data[i++];
        i++;
      }
      resolve(arr);
    };
    image.src = dataImageURL;
  });
}

export { dataImageURL };

export function findMatches(
  wordData: Uint8ClampedArray,
  mustHaveLetters: string,
  disallowedLetters: string,
  expectedLength: number,
) {
  const mustHave = new Set([...mustHaveLetters].map((c) => forward[c]));
  const disSet = new Set([...disallowedLetters].map((c) => forward[c]));
  const accepted: Set<string> = new Set();
  for (let i = 0; i < wordData.length; i += 6) {
    const word = [];
    for (let j = 0; j < 6; j++) {
      const ch = wordData[i + j];
      if (ch === 0) continue;
      if (disSet.has(ch)) {
        break;
      }
      word.push(ch);
    }
    if (
      word.length === expectedLength &&
      mustHave.size === new Set(word.filter((c) => mustHave.has(c))).size
    ) {
      accepted.add(word.map((c) => backward[c]).join(""));
    }
  }
  return accepted;
}
