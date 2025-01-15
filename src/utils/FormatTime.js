export const FormatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString();
}
