package org.example.managementproject.repository;

import org.example.managementproject.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(Long senderId, Long recipientId);
    List<ChatRoom> findBySenderIdOrRecipientId(Long senderId, Long recipientId);
    List<ChatRoom> findBySenderId(Long senderId);
}
