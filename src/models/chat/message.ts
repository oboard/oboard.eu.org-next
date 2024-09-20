
export type MessageInfo = {
    id: string;
    userId: string;
    content: string;
    time?: number | undefined;
    type?: string | undefined;
    status: MessageStatus;
};

export enum MessageStatus {
    Sending = 0,
    Sent = 1,
    // Received,
    // Seen,
}