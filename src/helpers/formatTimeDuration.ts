export const formatTimeDuration = (seconds: number): string => {
    const format = (val: number) => `0${Math.floor(val)}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${format(minutes)}:${format(secs)}`;
}