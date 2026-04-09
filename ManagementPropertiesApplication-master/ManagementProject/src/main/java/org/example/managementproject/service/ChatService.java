package org.example.managementproject.service;

import lombok.RequiredArgsConstructor;
import org.example.managementproject.dto.response.ChatMessageResponse;
import org.example.managementproject.dto.response.ChatRoomResponse;
import org.example.managementproject.model.ChatMessage;
import org.example.managementproject.model.ChatRoom;
import org.example.managementproject.model.User;
import org.example.managementproject.repository.ChatMessageRepository;
import org.example.managementproject.repository.ChatRoomRepository;
import org.example.managementproject.repository.UserRepository;
import org.example.managementproject.model.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatMessageResponse saveMessage(ChatMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setStatus(ChatMessage.MessageStatus.RECEIVED);
        
        // Ensure sender/recipient are loaded for the response
        User sender = userRepository.findById(chatMessage.getSender().getId()).orElseThrow();
        User recipient = userRepository.findById(chatMessage.getRecipient().getId()).orElseThrow();
        chatMessage.setSender(sender);
        chatMessage.setRecipient(recipient);
        
        ChatMessage saved = chatMessageRepository.save(chatMessage);
        return toMessageResponse(saved);
    }

    private ChatMessageResponse toMessageResponse(ChatMessage msg) {
        return ChatMessageResponse.builder()
                .id(msg.getId())
                .chatRoomId(msg.getChatRoomId())
                .senderId(msg.getSender().getId())
                .senderName(msg.getSender().getFirstName() + " " + msg.getSender().getLastName())
                .recipientId(msg.getRecipient().getId())
                .content(msg.getContent())
                .timestamp(msg.getTimestamp())
                .status(msg.getStatus().name())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> findChatMessages(Long senderId, Long recipientId) {
        Optional<String> chatId = getChatId(senderId, recipientId, false);
        return chatId.map(chatMessageRepository::findByChatRoomIdOrderByTimestampAsc)
                .map(msgs -> msgs.stream()
                        .map(this::toMessageResponse)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    @Transactional(readOnly = true)
    public List<ChatRoomResponse> findUserChatRooms(Long userId) {
        return chatRoomRepository.findBySenderId(userId)
                .stream()
                .map(this::toRoomResponse)
                .collect(Collectors.toList());
    }

    private ChatRoomResponse toRoomResponse(ChatRoom room) {
        return ChatRoomResponse.builder()
                .id(room.getId())
                .chatId(room.getChatId())
                .senderId(room.getSender().getId())
                .senderName(room.getSender().getFirstName() + " " + room.getSender().getLastName())
                .recipientId(room.getRecipient().getId())
                .recipientName(room.getRecipient().getFirstName() + " " + room.getRecipient().getLastName())
                .build();
    }

    public Optional<String> getChatId(Long senderId, Long recipientId, boolean createIfNotExist) {
        return chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId)
                .map(ChatRoom::getChatId)
                .or(() -> {
                    if (!createIfNotExist) return Optional.empty();
                    
                    String chatId = String.format("%d_%d", 
                        Math.min(senderId, recipientId), 
                        Math.max(senderId, recipientId));

                    User sender = userRepository.findById(senderId)
                        .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
                    User recipient = userRepository.findById(recipientId)
                        .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

                    ChatRoom senderRecipient = ChatRoom.builder()
                            .chatId(chatId)
                            .sender(sender)
                            .recipient(recipient)
                            .build();

                    ChatRoom recipientSender = ChatRoom.builder()
                            .chatId(chatId)
                            .sender(recipient)
                            .recipient(sender)
                            .build();

                    chatRoomRepository.save(senderRecipient);
                    chatRoomRepository.save(recipientSender);

                    return Optional.of(chatId);
                });
    }
}
