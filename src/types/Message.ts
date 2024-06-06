
// {
//     "event": "message",
//     "message": {
//         "role": "assistant",
//         "type": "answer",
//         "content": "=====\n",
//         "content_type": "text"
//     },
//     "is_finish": false,
//     "index": 0,
//     "conversation_id": "11213123",
//     "seq_id": 0
// }


interface Message {
    event: string;
    message: {
        role: string;
        type: string;
        content: string;
        content_type: string;
    };
    is_finish: boolean;
    index: number;
    conversation_id: string;
    seq_id: number;
}