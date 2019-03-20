export class LogMessage {
    message: string;
    date: Date;
    level: string;

    constructor(level: string, message: string) {
        this.date = new Date();
        this.level = level;
        this.message = message;
    }

    get localTime(): string {
        return this.date.toLocaleTimeString();
    }
}
