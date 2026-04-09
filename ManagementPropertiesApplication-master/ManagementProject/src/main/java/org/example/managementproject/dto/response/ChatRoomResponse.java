package org.example.managementproject.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatRoomResponse {
    private Long id;
    private String chatId;
    private Long senderId;
    private String senderName;
    private Long recipientId;
    private String recipientName;
}
