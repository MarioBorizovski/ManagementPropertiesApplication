package org.example.managementproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.response.ChatMessageResponse;
import org.example.managementproject.dto.response.ChatRoomResponse;
import org.example.managementproject.model.ChatMessage;
import org.example.managementproject.model.ChatRoom;
import org.example.managementproject.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        var chatId = chatService.getChatId(
                chatMessage.getSender().getId(),
                chatMessage.getRecipient().getId(),
                true
        ).orElseThrow();
        
        chatMessage.setChatRoomId(chatId);
        
        ChatMessageResponse response = chatService.saveMessage(chatMessage);
        
        // Notify recipient
        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getRecipient().getId()),
                "/queue/messages",
                response
        );
    }

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessageResponse>> findChatMessages(
            @PathVariable Long senderId,
            @PathVariable Long recipientId) {
        return ResponseEntity.ok(chatService.findChatMessages(senderId, recipientId));
    }

    @GetMapping("/rooms/{userId}")
    public ResponseEntity<List<ChatRoomResponse>> findUserRooms(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.findUserChatRooms(userId));
    }
}
