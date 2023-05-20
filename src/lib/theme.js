function hexToRgb(hex) {
  const sanitizedHex = hex.replaceAll("##", "#");
  const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    sanitizedHex
  );

  if (!colorParts) {
    return null;
  }

  const [, r, g, b] = colorParts;

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16),
  };
}

function rgbToHex(r, g, b) {
  const toHex = (c) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lighten(hex, intensity) {
  const color = hexToRgb(`#${hex}`);

  if (!color) {
    return "";
  }

  const r = Math.round(color.r + (255 - color.r) * intensity);
  const g = Math.round(color.g + (255 - color.g) * intensity);
  const b = Math.round(color.b + (255 - color.b) * intensity);

  return rgbToHex(r, g, b);
}

function darken(hex, intensity) {
  const color = hexToRgb(hex);

  if (!color) {
    return "";
  }

  const r = Math.round(color.r * intensity);
  const g = Math.round(color.g * intensity);
  const b = Math.round(color.b * intensity);

  return rgbToHex(r, g, b);
}
export const theme = {
  brandcolor: (color) => {
    return {
      brand50: lighten(color, 0.95),
      brand100: lighten(color, 0.9),
      brand200: lighten(color, 0.75),
      brand300: lighten(color, 0.6),
      brand400: lighten(color, 0.3),
      brand500: color,
      brand600: darken(color, 0.9),
      brand700: darken(color, 0.75),
      brand800: darken(color, 0.6),
      brand900: darken(color, 0.49),
    };
  },
};
