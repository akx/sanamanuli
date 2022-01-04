import json
import math

from PIL import Image

encoding = "iso-8859-1"

sanuli_letters = "\0abcdefghijklmnopqrstuvwxyzåäö"
sanuli_letter_set = set(sanuli_letters)

with open("words.txt", encoding="utf-8") as wl_file:
    all_words = sorted(set(
        w.strip().lower()
        for w in wl_file
        if len(w.strip()) in (5, 6) and set(w.strip()) <= sanuli_letter_set
    ))
#
#
# def encode_word(s: str):
#     indexes = [sanuli_letters.index(c) for c in s.ljust(6, "\0")]
#     r = (indexes[0] << 4) | indexes[1]
#     g = (indexes[2] << 4) | indexes[3]
#     b = (indexes[4] << 4) | indexes[5]
#     return (r, g, b)


def main():

    buffer = []
    for word in all_words:
        buffer.extend(word.encode(encoding).ljust(6, b'\0'))

    n_words = len(all_words)
    size = math.ceil(math.sqrt(n_words))
    ext_buffer = bytes(buffer).ljust(size * size * 3, b"\0")
    img = Image.frombuffer("RGB", (size, size), ext_buffer)

    img.save("src/data.png")
    img.save("src/data.bmp")

    forward_map = {c: c.encode(encoding)[0] for c in sanuli_letters}
    backward_map = {v: k for (k, v) in forward_map.items()}
    with open("src/map.ts", "w", encoding="utf-8") as outf:
        outf.write(f"export const forward: Record<string, number> = {json.dumps(forward_map, ensure_ascii=False)};\n")
        outf.write(f"export const backward: Record<number, string> = {json.dumps(backward_map, ensure_ascii=False)};\n")

if __name__ == '__main__':
    main()
