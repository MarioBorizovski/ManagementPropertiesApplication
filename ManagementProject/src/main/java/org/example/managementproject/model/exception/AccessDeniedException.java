package org.example.managementproject.model.exception;

public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) { super(message); }
}