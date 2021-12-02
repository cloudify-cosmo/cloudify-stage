declare module '*.png' {
    const imagePath: string;
    export default imagePath;
}

declare module '*.svg' {
    const content: any;
    export default content;
}
