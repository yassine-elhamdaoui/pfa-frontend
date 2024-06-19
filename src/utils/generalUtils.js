export function stringToColor(string) {
  if (!string) return;
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export function stringAvatar(name,dimentions,font,borderRadius) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: dimentions === undefined ? 35 : dimentions,
      height: dimentions === undefined ? 35 : dimentions,
      fontSize: font === undefined ? 20 : font,
      borderRadius: borderRadius === undefined ? "50%" : `${borderRadius}px`,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
